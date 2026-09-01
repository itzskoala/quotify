/**
 * Compact tap-to-select pill for the personalization screen (categories.tsx)
 * — a fast multi-select grid, distinct from <OptionCard>'s full-width row
 * (that's still used nowhere in onboarding v3, kept only in case a future
 * single-column list needs it).
 */
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { BrandFonts, OnboardingColors, Spacing } from '@/constants/theme';
import * as haptics from '@/lib/haptics';

type Props = {
  label: string;
  glyph: string;
  selected: boolean;
  accent: string;
  onPress: () => void;
};

export function MoodChip({ label, glyph, selected, accent, onPress }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => {
          haptics.soft();
          onPress();
        }}
        onPressIn={() => {
          // eslint-disable-next-line react-hooks/immutability
          scale.value = withSpring(0.94, { damping: 14, stiffness: 320 });
        }}
        onPressOut={() => {
          // eslint-disable-next-line react-hooks/immutability
          scale.value = withSpring(1, { damping: 12, stiffness: 260 });
        }}
        style={[
          styles.chip,
          selected && { backgroundColor: accent, borderColor: accent },
        ]}>
        <ThemedText style={styles.glyph}>{glyph}</ThemedText>
        <ThemedText style={[styles.label, selected && styles.labelSelected]}>{label}</ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1.5,
    borderColor: OnboardingColors.line,
    backgroundColor: OnboardingColors.card,
    borderRadius: 999,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
  },
  glyph: {
    fontSize: 16,
  },
  label: {
    fontFamily: BrandFonts.urbanistSemiBold,
    fontSize: 15,
    color: OnboardingColors.ink,
  },
  labelSelected: {
    color: OnboardingColors.card,
  },
});
