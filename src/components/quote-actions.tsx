/**
 * The row of actions under a quote, shared by Explore and the Feed: like, save
 * to favourites, send to Studio as a wallpaper, and — when the author has one —
 * open their story.
 */
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Quote } from '@/constants/quotable';
import { BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';
import { sendToStudio } from '@/lib/quote-bus';
import { useAppState } from '@/providers/app-state';

type Props = {
  quote: Quote;
  onStory?: () => void;
};

export function QuoteActions({ quote, onStory }: Props) {
  const { toggleLike, isLiked, toggleFavorite, isSaved } = useAppState();
  const c = useBrand();
  const s = styles(c);

  const liked = isLiked(quote);
  const saved = isSaved(quote);

  return (
    <View style={s.row}>
      <Pill
        c={c}
        active={liked}
        label={liked ? '♥ liked' : '♡ like'}
        onPress={() => {
          haptics.tap();
          toggleLike(quote);
        }}
      />
      <Pill
        c={c}
        active={saved}
        label={saved ? '✓ saved' : '+ save'}
        onPress={() => {
          haptics.success();
          toggleFavorite(quote);
        }}
      />
      <Pill
        c={c}
        label="▢ wallpaper"
        onPress={() => {
          haptics.tap();
          sendToStudio(quote);
          router.navigate('/studio');
        }}
      />
      {onStory ? (
        <Pill
          c={c}
          label="story →"
          emphasis
          onPress={() => {
            haptics.soft();
            onStory();
          }}
        />
      ) : null}
    </View>
  );
}

function Pill({
  c,
  label,
  onPress,
  active,
  emphasis,
}: {
  c: BrandPalette;
  label: string;
  onPress: () => void;
  active?: boolean;
  emphasis?: boolean;
}) {
  const s = styles(c);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.pill,
        active && s.pillActive,
        emphasis && s.pillEmphasis,
        pressed && s.pressed,
      ]}>
      <ThemedText
        style={[s.pillLabel, active && s.pillLabelActive, emphasis && s.pillLabelEmphasis]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: Spacing.two,
    },
    pill: {
      paddingVertical: Spacing.two,
      paddingHorizontal: Spacing.three,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.line,
      backgroundColor: c.raised,
    },
    pillActive: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    pillEmphasis: {
      borderColor: c.text,
    },
    pressed: {
      opacity: 0.6,
    },
    pillLabel: {
      fontFamily: BrandFonts.sansMedium,
      fontSize: 13,
      letterSpacing: 0.2,
      color: c.textDim,
    },
    pillLabelActive: {
      color: c.onAccent,
    },
    pillLabelEmphasis: {
      color: c.text,
    },
  });
