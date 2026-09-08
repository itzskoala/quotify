/**
 * The rounded pill button used across quote actions, Explore's Following
 * toggle, and anywhere else a small toggle/filter chip is needed. Extracted
 * from `quote-actions.tsx` so it has one definition.
 */
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';

type Props = {
  label: string;
  onPress: () => void;
  active?: boolean;
  /** A stronger hairline border, for a call-to-action pill among plain ones. */
  emphasis?: boolean;
};

export function Pill({ label, onPress, active, emphasis }: Props) {
  const c = useBrand();
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
      fontFamily: BrandFonts.valleyMedium,
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
