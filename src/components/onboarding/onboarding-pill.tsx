/**
 * Onboarding's colorful pill button — deliberately separate from the shared
 * <SquishyButton> (src/components/squishy-button.tsx), which is also used
 * outside onboarding (Today, Studio) and stays black-and-white. Same squish
 * + haptic + sound interaction, Urbanist type, explicit accent color.
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
  /** Accent color for the solid fill / outline border. Defaults to coral. */
  accent?: string;
  variant?: Variant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function OnboardingPill({
  label,
  onPress,
  accent = OnboardingColors.coral,
  variant = 'solid',
  disabled,
  style,
}: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function handlePressIn() {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(0.94, { damping: 14, stiffness: 320 });
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
        style={[
          styles.base,
          isSolid
            ? { backgroundColor: accent }
            : { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: accent },
          disabled && styles.disabled,
        ]}>
        <ThemedText
          style={[
            styles.label,
            { color: isSolid ? OnboardingColors.card : OnboardingColors.ink },
          ]}>
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
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontFamily: BrandFonts.urbanistSemiBold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
