/**
 * The emoji reaction picker — pops up when you long-press the like heart in
 * `PostDetailOverlay` (see `LikeHeart`). A curated grid, not a full system
 * emoji keyboard: multi-select, tap a picked one again to remove it.
 */
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';

const EMOJIS = [
  '❤️', '🔥', '💯', '👏', '🙌', '✨',
  '💪', '🎉', '😢', '😮', '😂', '🤔',
  '👀', '🌈', '🦋', '⚡', '🚀', '🏆',
  '💎', '👑',
];

type Props = {
  visible: boolean;
  selected: string[];
  onToggle: (emoji: string) => void;
  onClose: () => void;
};

export function ReactionPicker({ visible, selected, onToggle, onClose }: Props) {
  const c = useBrand();
  const s = styles(c);
  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => {
          haptics.tap();
          onClose();
        }}
      />
      <View style={s.center} pointerEvents="box-none">
        <View style={s.bubble}>
          <ThemedText style={s.hint}>react with as many as you like</ThemedText>
          <ScrollView contentContainerStyle={s.grid} showsVerticalScrollIndicator={false}>
            {EMOJIS.map((emoji) => {
              const active = selected.includes(emoji);
              return (
                <Pressable
                  key={emoji}
                  onPress={() => {
                    haptics.tap();
                    onToggle(emoji);
                  }}
                  style={[s.cell, active && s.cellActive]}>
                  <ThemedText style={s.emoji}>{emoji}</ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable
            onPress={() => {
              haptics.tap();
              onClose();
            }}
            style={s.done}>
            <ThemedText style={s.doneLabel}>done</ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    center: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.five,
    },
    bubble: {
      width: '100%',
      maxWidth: 340,
      backgroundColor: c.raised,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.line,
      padding: Spacing.four,
      alignItems: 'center',
      gap: Spacing.three,
    },
    hint: {
      fontFamily: BrandFonts.valley,
      fontSize: 13,
      color: c.textDim,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: Spacing.two,
    },
    cell: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.bg,
      borderWidth: 1,
      borderColor: c.line,
    },
    cellActive: {
      backgroundColor: c.accentSoft,
      borderColor: c.accent,
    },
    emoji: {
      fontSize: 22,
    },
    done: {
      marginTop: Spacing.one,
      paddingVertical: Spacing.two,
      paddingHorizontal: Spacing.five,
      borderRadius: 999,
      backgroundColor: c.accent,
    },
    doneLabel: {
      fontFamily: BrandFonts.valleyMedium,
      fontSize: 14,
      color: c.onAccent,
    },
  });
