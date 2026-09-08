/**
 * Me — the profile overlay. A profile photo, an editable username, and a bio
 * that is the user's single favourite quote, lettered by hand. Below: their
 * kept lines, the ones they liked, the wallpapers they made in Studio, and
 * their saved quotes grouped into collections by mood.
 *
 * Was a tab route (`src/app/profile.tsx`); now opened as a full-screen
 * overlay (see `lib/profile-bus.ts`) from an avatar button on Home/Explore,
 * following the same pattern as `StoryOverlay`.
 */
import * as ImagePicker from 'expo-image-picker';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { PaperCard } from '@/components/paper-card';
import { Segmented } from '@/components/segmented';
import { ThemedText } from '@/components/themed-text';
import { WallpaperCanvas } from '@/components/wallpaper-canvas';
import { LIBRARY, MOODS, type MoodId } from '@/constants/library';
import type { Quote } from '@/constants/quotable';
import { BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';
import { useAppState } from '@/providers/app-state';

type Section = 'favorites' | 'liked' | 'wallpapers' | 'collections';

const SECTIONS: { value: Section; label: string }[] = [
  { value: 'favorites', label: 'favorites' },
  { value: 'liked', label: 'liked' },
  { value: 'wallpapers', label: 'wallpapers' },
  { value: 'collections', label: 'collections' },
];

function moodOfText(text: string): MoodId | undefined {
  return LIBRARY.find((q) => q.text.trim() === text.trim())?.mood;
}

type Props = { onClose: () => void };

export function ProfileOverlay({ onClose }: Props) {
  const {
    profile,
    updateProfile,
    favorites,
    liked,
    wallpapers,
    following,
    toggleFavorite,
    toggleLike,
    removeWallpaper,
    resetOnboarding,
  } = useAppState();
  const c = useBrand();
  const s = styles(c);

  const [section, setSection] = useState<Section>('favorites');
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(profile.username);

  async function pickAvatar() {
    haptics.tap();
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!res.canceled && res.assets[0]) {
      updateProfile({ avatarUri: res.assets[0].uri });
    }
  }

  function saveName() {
    const clean = nameDraft.trim() || 'you';
    updateProfile({ username: clean });
    setNameDraft(clean);
    setEditing(false);
    haptics.success();
  }

  return (
    <View style={s.screen}>
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <View style={s.topbar}>
          <Pressable
            onPress={() => {
              haptics.tap();
              onClose();
            }}
            hitSlop={12}
            style={s.close}>
            <ThemedText style={s.closeLabel}>✕  close</ThemedText>
          </Pressable>
          <ThemedText style={s.kicker}>me</ThemedText>
        </View>

        <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
          {/* identity */}
          <View style={s.identity}>
            <Pressable onPress={pickAvatar}>
              <Avatar name={profile.username} uri={profile.avatarUri} size={96} />
              <ThemedText style={s.avatarHint}>edit</ThemedText>
            </Pressable>

            {editing ? (
              <View style={s.nameEdit}>
                <TextInput
                  value={nameDraft}
                  onChangeText={setNameDraft}
                  autoFocus
                  placeholder="username"
                  placeholderTextColor={c.textFaint}
                  style={s.nameInput}
                  onSubmitEditing={saveName}
                  maxLength={24}
                />
                <Pressable onPress={saveName} hitSlop={8}>
                  <ThemedText style={s.nameSave}>done</ThemedText>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => {
                  setNameDraft(profile.username);
                  setEditing(true);
                }}>
                <ThemedText style={s.username}>@{profile.username}</ThemedText>
              </Pressable>
            )}

            {/* bio = favourite quote */}
            {profile.bioQuote ? (
              <ThemedText style={s.bioQuote}>“{profile.bioQuote.text}”</ThemedText>
            ) : (
              <ThemedText style={s.bioEmpty}>
                your bio is your favourite line. tap ♥ on a favourite below to set it.
              </ThemedText>
            )}

            {/* stats */}
            <View style={s.stats}>
              <Stat c={c} n={favorites.length} label="favorites" />
              <Stat c={c} n={liked.length} label="liked" />
              <Stat c={c} n={wallpapers.length} label="wallpapers" />
              <Stat c={c} n={following.length} label="following" />
            </View>
          </View>

          <View style={s.segmentWrap}>
            <Segmented options={SECTIONS} value={section} onChange={setSection} scroll />
          </View>

          {section === 'favorites' ? (
            <QuoteSection
              quotes={favorites}
              emptyText="nothing kept yet. tap save on a quote and it waits here."
              isBio={(q) => profile.bioQuote?.text.trim() === q.text.trim()}
              onSetBio={(q) => {
                haptics.success();
                updateProfile({ bioQuote: q });
              }}
              onRemove={toggleFavorite}
            />
          ) : null}

          {section === 'liked' ? (
            <QuoteSection
              quotes={liked}
              emptyText="no likes yet. tap ♡ on a quote in Explore."
              onRemove={toggleLike}
            />
          ) : null}

          {section === 'wallpapers' ? (
            <WallpaperGrid wallpapers={wallpapers} onRemove={removeWallpaper} />
          ) : null}

          {section === 'collections' ? (
            <Collections favorites={favorites} liked={liked} />
          ) : null}

          {__DEV__ ? (
            <View style={s.devSection}>
              <ThemedText style={s.devLabel}>developer</ThemedText>
              <Pressable
                onPress={() => {
                  haptics.tap();
                  void resetOnboarding();
                }}
                style={({ pressed }) => [s.devButton, pressed && s.pressed]}>
                <ThemedText style={s.devButtonLabel}>restart onboarding</ThemedText>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Stat({ c, n, label }: { c: BrandPalette; n: number; label: string }) {
  const s = styles(c);
  return (
    <View style={s.stat}>
      <ThemedText style={s.statN}>{n}</ThemedText>
      <ThemedText style={s.statLabel}>{label}</ThemedText>
    </View>
  );
}

function QuoteSection({
  quotes,
  emptyText,
  onRemove,
  onSetBio,
  isBio,
}: {
  quotes: Quote[];
  emptyText: string;
  onRemove: (q: Quote) => void;
  onSetBio?: (q: Quote) => void;
  isBio?: (q: Quote) => boolean;
}) {
  const c = useBrand();
  const s = styles(c);
  if (quotes.length === 0) {
    return <ThemedText style={s.empty}>{emptyText}</ThemedText>;
  }
  return (
    <View style={s.list}>
      {quotes.map((q, i) => (
        <View key={`${q.id}-${i}`} style={s.listItem}>
          <PaperCard quote={q} compact />
          <View style={s.itemActions}>
            {onSetBio ? (
              <SmallLink
                c={c}
                label={isBio?.(q) ? '★ your bio' : 'set as bio'}
                onPress={() => onSetBio(q)}
              />
            ) : null}
            <SmallLink
              c={c}
              label="remove"
              onPress={() => {
                haptics.tap();
                onRemove(q);
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function WallpaperGrid({
  wallpapers,
  onRemove,
}: {
  wallpapers: import('@/constants/quotable').Wallpaper[];
  onRemove: (id: string) => void;
}) {
  const c = useBrand();
  const s = styles(c);
  if (wallpapers.length === 0) {
    return (
      <ThemedText style={s.empty}>
        no wallpapers yet. head to Studio and make one from a line you love.
      </ThemedText>
    );
  }
  return (
    <View style={s.grid}>
      {wallpapers.map((w) => (
        <View key={w.id} style={s.thumbWrap}>
          <View style={s.thumb}>
            <WallpaperCanvas wallpaper={w} preview />
          </View>
          <Pressable
            onPress={() => {
              haptics.tap();
              onRemove(w.id);
            }}
            hitSlop={8}
            style={s.thumbRemove}>
            <ThemedText style={s.thumbRemoveLabel}>✕</ThemedText>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

function Collections({ favorites, liked }: { favorites: Quote[]; liked: Quote[] }) {
  const c = useBrand();
  const s = styles(c);

  const groups = useMemo(() => {
    const seen = new Set<string>();
    const all: Quote[] = [];
    for (const q of [...favorites, ...liked]) {
      const key = q.text.trim();
      if (!seen.has(key)) {
        seen.add(key);
        all.push(q);
      }
    }
    const byMood = new Map<MoodId | 'unfiled', Quote[]>();
    for (const q of all) {
      const mood = moodOfText(q.text) ?? 'unfiled';
      const arr = byMood.get(mood) ?? [];
      arr.push(q);
      byMood.set(mood, arr);
    }
    return byMood;
  }, [favorites, liked]);

  if (groups.size === 0) {
    return (
      <ThemedText style={s.empty}>
        save and like quotes and they’ll gather into collections by mood.
      </ThemedText>
    );
  }

  const order: (MoodId | 'unfiled')[] = [...MOODS.map((m) => m.id), 'unfiled'];

  return (
    <View style={s.collections}>
      {order
        .filter((k) => groups.has(k))
        .map((k) => {
          const mood = MOODS.find((m) => m.id === k);
          const items = groups.get(k) ?? [];
          return (
            <View key={k} style={s.collection}>
              <ThemedText style={s.collectionTitle}>
                {mood ? `${mood.glyph}  ${mood.label}` : '✎  your own lines'}
                <ThemedText style={s.collectionCount}> · {items.length}</ThemedText>
              </ThemedText>
              {items.map((q, i) => (
                <ThemedText key={`${q.id}-${i}`} style={s.collectionLine} numberOfLines={2}>
                  “{q.text}”
                </ThemedText>
              ))}
            </View>
          );
        })}
    </View>
  );
}

function SmallLink({ c, label, onPress }: { c: BrandPalette; label: string; onPress: () => void }) {
  const s = styles(c);
  return (
    <Pressable onPress={onPress} hitSlop={6} style={({ pressed }) => pressed && s.pressed}>
      <ThemedText style={s.smallLink}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    screen: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: c.bg,
    },
    safe: { flex: 1 },
    topbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.two,
      paddingBottom: Spacing.two,
    },
    close: {
      paddingVertical: Spacing.one,
    },
    closeLabel: {
      fontFamily: BrandFonts.sansMedium,
      fontSize: 13,
      color: c.textDim,
      letterSpacing: 0.3,
    },
    kicker: {
      fontFamily: BrandFonts.sans,
      fontSize: 12,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: c.textFaint,
    },
    body: {
      paddingBottom: Spacing.six,
    },
    identity: {
      alignItems: 'center',
      paddingTop: Spacing.two,
      paddingHorizontal: Spacing.four,
      gap: Spacing.two,
    },
    avatarHint: {
      fontFamily: BrandFonts.sans,
      fontSize: 11,
      color: c.textDim,
      textAlign: 'center',
      marginTop: Spacing.one,
    },
    username: {
      fontFamily: BrandFonts.hand,
      fontSize: 34,
      lineHeight: 40,
      color: c.text,
      marginTop: Spacing.one,
    },
    nameEdit: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
      marginTop: Spacing.one,
    },
    nameInput: {
      fontFamily: BrandFonts.hand,
      fontSize: 30,
      color: c.text,
      minWidth: 160,
      borderBottomWidth: 1,
      borderBottomColor: c.line,
      paddingVertical: Spacing.one,
      textAlign: 'center',
    },
    nameSave: {
      fontFamily: BrandFonts.sansMedium,
      fontSize: 14,
      color: c.accent,
    },
    bioQuote: {
      fontFamily: BrandFonts.hand,
      fontSize: 22,
      lineHeight: 28,
      color: c.textDim,
      textAlign: 'center',
      paddingHorizontal: Spacing.three,
      marginTop: Spacing.two,
    },
    bioEmpty: {
      fontFamily: BrandFonts.sans,
      fontSize: 13,
      lineHeight: 19,
      color: c.textFaint,
      textAlign: 'center',
      paddingHorizontal: Spacing.four,
      marginTop: Spacing.two,
    },
    stats: {
      flexDirection: 'row',
      gap: Spacing.five,
      marginTop: Spacing.four,
    },
    stat: {
      alignItems: 'center',
    },
    statN: {
      fontFamily: BrandFonts.hand,
      fontSize: 26,
      color: c.text,
    },
    statLabel: {
      fontFamily: BrandFonts.sans,
      fontSize: 11,
      letterSpacing: 0.4,
      color: c.textDim,
    },
    segmentWrap: {
      paddingTop: Spacing.five,
      paddingBottom: Spacing.two,
    },
    list: {
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.three,
      gap: Spacing.five,
    },
    listItem: {
      gap: Spacing.two,
    },
    itemActions: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: Spacing.four,
    },
    smallLink: {
      fontFamily: BrandFonts.sansMedium,
      fontSize: 13,
      color: c.textDim,
    },
    pressed: {
      opacity: 0.5,
    },
    empty: {
      fontFamily: BrandFonts.sans,
      fontSize: 14,
      lineHeight: 21,
      color: c.textDim,
      textAlign: 'center',
      paddingHorizontal: Spacing.five,
      paddingTop: Spacing.six,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.three,
      gap: Spacing.three,
    },
    thumbWrap: {
      width: '30.5%',
    },
    thumb: {
      width: '100%',
      aspectRatio: 9 / 16,
      borderRadius: 14,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: c.line,
    },
    thumbRemove: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: 'rgba(0,0,0,0.55)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    thumbRemoveLabel: {
      color: '#fff',
      fontSize: 12,
      fontFamily: BrandFonts.sansMedium,
    },
    collections: {
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.three,
      gap: Spacing.five,
    },
    collection: {
      gap: Spacing.two,
    },
    collectionTitle: {
      fontFamily: BrandFonts.hand,
      fontSize: 24,
      color: c.text,
    },
    collectionCount: {
      fontFamily: BrandFonts.sans,
      fontSize: 13,
      color: c.textFaint,
    },
    collectionLine: {
      fontFamily: BrandFonts.sans,
      fontSize: 14,
      lineHeight: 21,
      color: c.textDim,
      paddingLeft: Spacing.two,
    },
    devSection: {
      alignItems: 'center',
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.six,
      gap: Spacing.two,
    },
    devLabel: {
      fontFamily: BrandFonts.sans,
      fontSize: 10,
      letterSpacing: 1,
      color: c.textFaint,
      textTransform: 'uppercase',
    },
    devButton: {
      paddingVertical: Spacing.two,
      paddingHorizontal: Spacing.four,
      borderRadius: 999,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: c.textFaint,
    },
    devButtonLabel: {
      fontFamily: BrandFonts.sansMedium,
      fontSize: 13,
      color: c.textDim,
    },
  });
