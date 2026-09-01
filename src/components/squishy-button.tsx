/**
 * A pressable that squishes on touch, taps a haptic, and plays a creamy squish
 * sound. Reused for Save / Share / Another and onboarding CTAs.
 */
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';
import * as sound from '@/lib/sound';

type Variant = 'primary' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  /** Leading glyph. */
  icon?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SquishyButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  style,
}: Props) {
  const c = useBrand();
  const s = styles(c);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    // Reanimated shared values are mutated by design; the compiler linter
    // over-flags this as an immutability violation.
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(0.94, { damping: 14, stiffness: 320 });
    haptics.tap();
    sound.squish();
  }

  function handlePressOut() {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(1, { damping: 12, stiffness: 260 });
  }

  const isPrimary = variant === 'primary';

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[s.base, isPrimary ? s.primary : s.ghost, disabled && s.disabled]}>
        <ThemedText style={[s.label, isPrimary ? s.labelPrimary : s.labelGhost]}>
          {icon ? `${icon}  ` : ''}
          {label}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    base: {
      paddingVertical: Spacing.three,
      paddingHorizontal: Spacing.four,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      backgroundColor: c.accent,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: c.line,
    },
    disabled: {
      opacity: 0.4,
    },
    label: {
      fontFamily: BrandFonts.sansMedium,
      fontSize: 15,
      letterSpacing: 0.2,
    },
    labelPrimary: {
      color: c.onAccent,
    },
    labelGhost: {
      color: c.text,
    },
  });
