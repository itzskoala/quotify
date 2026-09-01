/**
 * The quote display — the heart of the "connect" moment. An editorial serif
 * line, a hand-drawn terracotta underline, quiet attribution.
 */
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Doodle } from '@/components/doodle';
import { ThemedText } from '@/components/themed-text';
import type { Quote } from '@/constants/quotable';
import { BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';

type Props = {
  quote: Quote;
  style?: StyleProp<ViewStyle>;
  /** Smaller type + a hairline frame, for dense list rows. */
  compact?: boolean;
};

export function PaperCard({ quote, style, compact }: Props) {
  const c = useBrand();
  const s = styles(c);
  return (
    <View style={[s.card, compact && s.cardCompact, style]}>
      <ThemedText style={[s.quote, compact && s.quoteCompact]} allowFontScaling>
        {quote.text}
      </ThemedText>

      <View style={s.underline}>
        <Doodle name="underline" size={compact ? 120 : 150} color={c.accent} />
      </View>

      <ThemedText style={s.author}>
        {quote.author ? quote.author.toLowerCase() : 'unsigned'}
      </ThemedText>

      {!compact && quote.reflection ? (
        <ThemedText style={s.reflection}>{quote.reflection}</ThemedText>
      ) : null}
    </View>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    card: {
      alignItems: 'center',
      gap: Spacing.two,
      paddingHorizontal: Spacing.three,
    },
    cardCompact: {
      backgroundColor: c.raised,
      borderColor: c.line,
      borderWidth: 1,
      borderRadius: 18,
      paddingVertical: Spacing.four,
      paddingHorizontal: Spacing.four,
    },
    quote: {
      fontFamily: BrandFonts.serif,
      color: c.text,
      fontSize: 36,
      lineHeight: 42,
      textAlign: 'center',
      letterSpacing: 0.2,
    },
    quoteCompact: {
      fontSize: 26,
      lineHeight: 31,
    },
    underline: {
      marginTop: Spacing.one,
    },
    author: {
      fontFamily: BrandFonts.sans,
      color: c.textDim,
      fontSize: 12,
      letterSpacing: 0.6,
      marginTop: Spacing.one,
    },
    reflection: {
      fontFamily: BrandFonts.sans,
      color: c.textDim,
      fontSize: 15,
      lineHeight: 23,
      textAlign: 'center',
      marginTop: Spacing.three,
      paddingHorizontal: Spacing.two,
    },
  });
