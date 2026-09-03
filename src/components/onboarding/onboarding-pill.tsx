/**
 * Onboarding's pill button — deliberately separate from the shared
 * <SquishyButton> (src/components/squishy-button.tsx), which is also used
 * outside onboarding (Today, Studio). Same squish + haptic + sound
 * interaction. v4: monochrome — solid is a white pill with charcoal text
 * (the one bright thing on every gradient screen), outline is a translucent
 * white border for secondary actions.
 */
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { BrandFonts, OnboardingColors, Spacing } from '@/constants/theme';
import * as haptics from '@/lib/haptics';
import * as sound from '@/lib/sound';

type Variant = 'solid' | 'outline';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function OnboardingPill({ label, onPress, variant = 'solid', disabled, style }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function handlePressIn() {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(0.96, { damping: 14, stiffness: 320 });
    haptics.tap();
    sound.squish();
  }

  function handlePressOut() {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(1, { damping: 12, stiffness: 260 });
  }

  const isSolid = variant === 'solid';

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[styles.base, isSolid ? styles.solid : styles.outline, disabled && styles.disabled]}>
        <ThemedText style={[styles.label, { color: isSolid ? '#19191B' : OnboardingColors.ink }]}>
          {label}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: OnboardingColors.ink,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: OnboardingColors.line,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontFamily: BrandFonts.googleSansMedium,
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
