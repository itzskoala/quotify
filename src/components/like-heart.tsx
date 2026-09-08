/**
 * The primary engagement control in `PostDetailOverlay` — a quick tap toggles
 * the plain heart-like (unchanged, existing `toggleLike`/`isLiked`); holding
 * it down opens `ReactionPicker` for picking any number of emoji reactions,
 * layered on top of the plain like, not a replacement for it.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { HeartIcon } from '@/components/post-icons';
import { ReactionPicker } from '@/components/reaction-picker';
import { ThemedText } from '@/components/themed-text';
import type { Quote } from '@/constants/quotable';
import { BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';
import { useAppState } from '@/providers/app-state';

type Props = {
  quote: Quote;
  count: number;
};

export function LikeHeart({ quote, count }: Props) {
  const { isLiked, toggleLike, reactionsFor, toggleReaction } = useAppState();
  const c = useBrand();
  const s = styles(c);
  const [pickerOpen, setPickerOpen] = useState(false);

  const liked = isLiked(quote);
  const myReactions = reactionsFor(quote);
  const displayCount = count + (liked ? 1 : 0);

  return (
    <View style={s.wrap}>
      <Pressable
        onPress={() => {
          haptics.tap();
          toggleLike(quote);
        }}
        onLongPress={() => {
          haptics.medium();
          setPickerOpen(true);
        }}
        delayLongPress={350}
        hitSlop={8}
        style={s.button}>
        <HeartIcon color={liked ? '#E0245E' : c.textDim} filled={liked} size={24} />
        <ThemedText style={s.count}>{displayCount}</ThemedText>
      </Pressable>

      {myReactions.length > 0 ? (
        <View style={s.badges}>
          {myReactions.map((emoji) => (
            <ThemedText key={emoji} style={s.badge}>
              {emoji}
            </ThemedText>
          ))}
        </View>
      ) : null}

      <ReactionPicker
        visible={pickerOpen}
        selected={myReactions}
        onToggle={(emoji) => toggleReaction(quote, emoji)}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    // Icon + count sit inline side by side, Pinterest-style — not stacked.
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.one,
    },
    count: {
      fontFamily: BrandFonts.valley,
      fontSize: 14,
      color: c.textDim,
    },
    badges: {
      flexDirection: 'row',
      marginLeft: Spacing.one,
      gap: 2,
    },
    badge: {
      fontSize: 13,
    },
  });
