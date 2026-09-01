/**
 * Shared selectable row used by every onboarding v2 question (single- and
 * multi-select alike) — keeps six question screens from re-implementing the
 * same pressable/selected-state styling.
 */
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BrandFonts, OnboardingColors, Spacing } from '@/constants/theme';
import * as haptics from '@/lib/haptics';

type Props = {
  label: string;
  hint?: string;
  selected: boolean;
  accent: string;
  onPress: () => void;
};

export function OptionCard({ label, hint, selected, accent, onPress }: Props) {
  return (
    <Pressable
      onPress={() => {
        haptics.soft();
        onPress();
      }}
      style={[
        styles.row,
        selected && { backgroundColor: accent, borderColor: accent },
      ]}>
      <View style={styles.text}>
        <ThemedText style={[styles.label, selected && styles.labelSelected]}>{label}</ThemedText>
        {hint ? (
          <ThemedText style={[styles.hint, selected && styles.hintSelected]}>{hint}</ThemedText>
        ) : null}
      </View>
      <View style={[styles.tick, selected && styles.tickSelected]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: OnboardingColors.line,
    backgroundColor: OnboardingColors.card,
    borderRadius: 16,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  text: {
    flex: 1,
    paddingRight: Spacing.two,
  },
  label: {
    fontFamily: BrandFonts.urbanistSemiBold,
    fontSize: 16,
    color: OnboardingColors.ink,
  },
  labelSelected: {
    color: OnboardingColors.card,
  },
  hint: {
    fontFamily: BrandFonts.urbanist,
    fontSize: 12,
    color: OnboardingColors.inkDim,
    marginTop: 2,
  },
  hintSelected: {
    color: OnboardingColors.card,
    opacity: 0.85,
  },
  tick: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: OnboardingColors.line,
  },
  tickSelected: {
    backgroundColor: OnboardingColors.card,
    borderColor: OnboardingColors.card,
  },
});
