/**
 * Studio — the wallpaper maker. Take a quote (sent from Explore/Feed/Profile,
 * picked here, or shuffled), drop it on a grayscale preset background or one of
 * your own photos, tune the type, then save it to your studio or share it.
 *
 * Your own art studio for the lines you love.
 */
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

import { QuotePicker } from '@/components/quote-picker';
import { SquishyButton } from '@/components/squishy-button';
import { ThemedText } from '@/components/themed-text';
import { WallpaperCanvas } from '@/components/wallpaper-canvas';
import { LIBRARY, WALLPAPER_PRESETS, type WallpaperPreset } from '@/constants/library';
import type { Quote, Wallpaper } from '@/constants/quotable';
import { BottomTabInset, BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';
import { clearPendingStudioQuote, usePendingStudioQuote } from '@/lib/quote-bus';
import { useAppState } from '@/providers/app-state';

function randomQuote(pool: readonly Quote[]): Quote {
  const list = pool.length > 0 ? pool : LIBRARY;
  return list[Math.floor(Math.random() * list.length)];
}

export default function StudioScreen() {
  const { favorites, liked, addWallpaper } = useAppState();
  const c = useBrand();
  const s = styles(c);
  const canvasRef = useRef<View>(null);
  const pending = usePendingStudioQuote();

  const pool = [...favorites, ...liked];
  const [quote, setQuote] = useState<Quote>(() => (pool.length ? pool[0] : randomQuote(LIBRARY)));
  const [presetId, setPresetId] = useState<string>('ink');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [ink, setInk] = useState<'light' | 'dark'>('light');
  const [align, setAlign] = useState<'center' | 'left'>('center');
  const [fontScale, setFontScale] = useState(1);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Consume a quote handed over from another tab. Syncing external (bus) state
  // into local state is exactly what this effect is for.
  useEffect(() => {
    if (pending) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuote(pending);
      setSaved(false);
      clearPendingStudioQuote();
    }
  }, [pending]);

  const draft: Wallpaper = {
    id: 'draft',
    text: quote.text,
    author: quote.author,
    presetId,
    photoUri,
    ink,
    align,
    fontScale,
    createdAt: 0,
  };

  function choosePreset(p: WallpaperPreset) {
    haptics.tap();
    setPresetId(p.id);
    setPhotoUri(null);
    setInk(p.ink);
    setSaved(false);
  }

  async function pickPhoto() {
    haptics.tap();
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
    });
    if (!res.canceled && res.assets[0]) {
      setPhotoUri(res.assets[0].uri);
      setInk('light');
      setSaved(false);
    }
  }

  function handleSave() {
    haptics.success();
    addWallpaper({ ...draft, id: `wp-${Date.now()}`, createdAt: Date.now() });
    setSaved(true);
  }

  async function handleShare() {
    try {
      const uri = await captureRef(canvasRef, { format: 'png', quality: 1 });
      if (Platform.OS === 'web') {
        await Share.share({ message: `${quote.text}${quote.author ? ` — ${quote.author}` : ''}` });
      } else {
        await Share.share({ url: uri });
      }
    } catch {
      // Capture unsupported (e.g. web) — fall back to sharing the text.
      await Share.share({
        message: `${quote.text}${quote.author ? ` — ${quote.author}` : ''}\n\nmade in Quotable`,
      });
    }
  }

  return (
    <View style={s.screen}>
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.header}>
          <ThemedText style={s.kicker}>wallpaper studio</ThemedText>
          <ThemedText style={s.title}>studio</ThemedText>
        </View>

        <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
          {/* live canvas */}
          <View style={s.canvasWrap}>
            <View ref={canvasRef} collapsable={false} style={s.canvas}>
              <WallpaperCanvas wallpaper={draft} />
            </View>
          </View>

          {/* quote controls */}
          <View style={s.section}>
            <View style={s.rowBetween}>
              <ThemedText style={s.sectionLabel}>the words</ThemedText>
              <View style={s.inlineActions}>
                <MiniButton
                  c={c}
                  label="shuffle"
                  onPress={() => {
                    haptics.tap();
                    setQuote(randomQuote(pool));
                    setSaved(false);
                  }}
                />
                <MiniButton c={c} label="choose" onPress={() => setPickerOpen(true)} />
              </View>
            </View>
            <ThemedText style={s.quotePreview} numberOfLines={3}>
              “{quote.text}”
            </ThemedText>
          </View>

          {/* backgrounds */}
          <View style={s.section}>
            <ThemedText style={s.sectionLabel}>background</ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.swatchRow}>
              <Pressable onPress={pickPhoto} style={[s.swatch, s.photoSwatch]}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
                ) : (
                  <ThemedText style={s.photoLabel}>＋{'\n'}photo</ThemedText>
                )}
              </Pressable>
              {WALLPAPER_PRESETS.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => choosePreset(p)}
                  style={[s.swatch, !photoUri && presetId === p.id && s.swatchOn]}>
                  <PresetSwatch preset={p} />
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* type controls */}
          <View style={s.section}>
            <ThemedText style={s.sectionLabel}>type</ThemedText>
            <View style={s.controlsRow}>
              <Toggle
                c={c}
                label="ink"
                value={ink === 'dark' ? 'dark' : 'light'}
                options={[
                  { v: 'light', l: 'light' },
                  { v: 'dark', l: 'dark' },
                ]}
                onPick={(v) => {
                  haptics.tap();
                  setInk(v as 'light' | 'dark');
                }}
              />
              <Toggle
                c={c}
                label="align"
                value={align}
                options={[
                  { v: 'center', l: 'center' },
                  { v: 'left', l: 'left' },
                ]}
                onPick={(v) => {
                  haptics.tap();
                  setAlign(v as 'center' | 'left');
                }}
              />
            </View>
            <View style={s.sizeRow}>
              <ThemedText style={s.sizeLabel}>size</ThemedText>
              <MiniButton
                c={c}
                label="A −"
                onPress={() => {
                  haptics.tap();
                  setFontScale((f) => Math.max(0.8, +(f - 0.1).toFixed(1)));
                }}
              />
              <MiniButton
                c={c}
                label="A ＋"
                onPress={() => {
                  haptics.tap();
                  setFontScale((f) => Math.min(1.4, +(f + 0.1).toFixed(1)));
                }}
              />
            </View>
          </View>

          <View style={s.actions}>
            <SquishyButton
              label={saved ? 'saved ✓' : 'save to studio'}
              variant={saved ? 'ghost' : 'primary'}
              onPress={handleSave}
              style={s.action}
            />
            <SquishyButton label="share" variant="ghost" onPress={handleShare} style={s.action} />
          </View>
        </ScrollView>
      </SafeAreaView>

      {pickerOpen ? (
        <QuotePicker
          onPick={(qq) => {
            setQuote(qq);
            setSaved(false);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </View>
  );
}

function PresetSwatch({ preset }: { preset: WallpaperPreset }) {
  if (preset.kind === 'gradient') {
    return <LinearGradient colors={preset.colors} style={StyleSheet.absoluteFill} />;
  }
  return <View style={[StyleSheet.absoluteFill, { backgroundColor: preset.colors[0] }]} />;
}

function MiniButton({ c, label, onPress }: { c: BrandPalette; label: string; onPress: () => void }) {
  const s = styles(c);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.mini, pressed && s.pressed]}>
      <ThemedText style={s.miniLabel}>{label}</ThemedText>
    </Pressable>
  );
}

function Toggle({
  c,
  label,
  value,
  options,
  onPick,
}: {
  c: BrandPalette;
  label: string;
  value: string;
  options: { v: string; l: string }[];
  onPick: (v: string) => void;
}) {
  const s = styles(c);
  return (
    <View style={s.toggle}>
      <ThemedText style={s.toggleLabel}>{label}</ThemedText>
      <View style={s.toggleOpts}>
        {options.map((o) => {
          const on = o.v === value;
          return (
            <Pressable key={o.v} onPress={() => onPick(o.v)} style={[s.toggleOpt, on && s.toggleOptOn]}>
              <ThemedText style={[s.toggleOptLabel, on && s.toggleOptLabelOn]}>{o.l}</ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    safe: { flex: 1 },
    header: {
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.four,
      gap: Spacing.half,
    },
    kicker: {
      fontFamily: BrandFonts.sans,
      fontSize: 12,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: c.textFaint,
    },
    title: {
      fontFamily: BrandFonts.hand,
      fontSize: 44,
      lineHeight: 50,
      color: c.text,
    },
    body: {
      paddingBottom: BottomTabInset + Spacing.six,
    },
    canvasWrap: {
      alignItems: 'center',
      paddingTop: Spacing.four,
    },
    canvas: {
      width: 220,
      aspectRatio: 9 / 16,
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: c.line,
    },
    section: {
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.five,
      gap: Spacing.two,
    },
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    inlineActions: {
      flexDirection: 'row',
      gap: Spacing.two,
    },
    sectionLabel: {
      fontFamily: BrandFonts.sans,
      fontSize: 12,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: c.textFaint,
    },
    quotePreview: {
      fontFamily: BrandFonts.hand,
      fontSize: 24,
      lineHeight: 30,
      color: c.text,
    },
    swatchRow: {
      gap: Spacing.three,
      paddingVertical: Spacing.one,
    },
    swatch: {
      width: 54,
      height: 54,
      borderRadius: 14,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: c.line,
    },
    swatchOn: {
      borderWidth: 2,
      borderColor: c.accent,
    },
    photoSwatch: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.raised,
    },
    photoLabel: {
      fontFamily: BrandFonts.sansMedium,
      fontSize: 11,
      lineHeight: 14,
      textAlign: 'center',
      color: c.textDim,
    },
    controlsRow: {
      flexDirection: 'row',
      gap: Spacing.three,
    },
    toggle: {
      flex: 1,
      gap: Spacing.one,
    },
    toggleLabel: {
      fontFamily: BrandFonts.sans,
      fontSize: 12,
      color: c.textDim,
    },
    toggleOpts: {
      flexDirection: 'row',
      gap: Spacing.one,
    },
    toggleOpt: {
      flex: 1,
      paddingVertical: Spacing.two,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.line,
      alignItems: 'center',
    },
    toggleOptOn: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    toggleOptLabel: {
      fontFamily: BrandFonts.sansMedium,
      fontSize: 13,
      color: c.textDim,
    },
    toggleOptLabelOn: {
      color: c.onAccent,
    },
    sizeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
      marginTop: Spacing.two,
    },
    sizeLabel: {
      fontFamily: BrandFonts.sans,
      fontSize: 12,
      color: c.textDim,
      marginRight: Spacing.two,
    },
    mini: {
      paddingVertical: Spacing.one + 2,
      paddingHorizontal: Spacing.three,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.line,
      backgroundColor: c.raised,
    },
    pressed: {
      opacity: 0.6,
    },
    miniLabel: {
      fontFamily: BrandFonts.sansMedium,
      fontSize: 13,
      color: c.text,
    },
    actions: {
      flexDirection: 'row',
      gap: Spacing.two,
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.five,
    },
    action: {
      flex: 1,
    },
  });
