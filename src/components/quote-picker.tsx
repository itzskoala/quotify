/**
 * A full-screen picker for choosing which quote to put on a wallpaper. Lists the
 * user's favourites and liked quotes first, then the full mood library.
 */
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { LIBRARY } from '@/constants/library';
import type { Quote } from '@/constants/quotable';
import { BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';
import { useAppState } from '@/providers/app-state';

type Props = {
  onPick: (quote: Quote) => void;
  onClose: () => void;
};

export function QuotePicker({ onPick, onClose }: Props) {
  const { favorites, liked } = useAppState();
  const c = useBrand();
  const s = styles(c);

  const sections = useMemo(() => {
    const own = [...favorites, ...liked];
    const ownKeys = new Set(own.map((q) => q.text.trim()));
    const libraryRest = LIBRARY.filter((q) => !ownKeys.has(q.text.trim()));
    return [
      { title: 'your favourites', data: favorites },
      { title: 'liked', data: liked },
      { title: 'from the library', data: libraryRest as Quote[] },
    ].filter((sec) => sec.data.length > 0);
  }, [favorites, liked]);

  return (
    <View style={s.screen}>
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <View style={s.topbar}>
          <ThemedText style={s.heading}>choose a line</ThemedText>
          <Pressable
            onPress={() => {
              haptics.tap();
              onClose();
            }}
            hitSlop={12}>
            <ThemedText style={s.close}>✕</ThemedText>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
          {sections.map((sec) => (
            <View key={sec.title} style={s.section}>
              <ThemedText style={s.sectionTitle}>{sec.title}</ThemedText>
              {sec.data.map((q, i) => (
                <Pressable
                  key={`${q.id}-${i}`}
                  onPress={() => {
                    haptics.soft();
                    onPick(q);
                  }}
                  style={({ pressed }) => [s.item, pressed && s.pressed]}>
                  <ThemedText style={s.itemText} numberOfLines={3}>
                    “{q.text}”
                  </ThemedText>
                  {q.author ? <ThemedText style={s.itemAuthor}>— {q.author}</ThemedText> : null}
                </Pressable>
              ))}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
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
      paddingVertical: Spacing.three,
    },
    heading: {
      fontFamily: BrandFonts.hand,
      fontSize: 30,
      color: c.text,
    },
    close: {
      fontFamily: BrandFonts.sansMedium,
      fontSize: 18,
      color: c.textDim,
    },
    body: {
      paddingHorizontal: Spacing.four,
      paddingBottom: Spacing.six,
    },
    section: {
      marginBottom: Spacing.four,
      gap: Spacing.two,
    },
    sectionTitle: {
      fontFamily: BrandFonts.sans,
      fontSize: 12,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: c.textFaint,
      marginBottom: Spacing.one,
    },
    item: {
      padding: Spacing.three,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.line,
      backgroundColor: c.raised,
      gap: Spacing.one,
    },
    pressed: {
      opacity: 0.6,
    },
    itemText: {
      fontFamily: BrandFonts.hand,
      fontSize: 22,
      lineHeight: 27,
      color: c.text,
    },
    itemAuthor: {
      fontFamily: BrandFonts.sans,
      fontSize: 12,
      color: c.textDim,
    },
  });
