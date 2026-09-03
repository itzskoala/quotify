/**
 * Top control row shared by every onboarding v4 screen except the splash:
 * a left chevron ("back", omitted on the first real step) and a right "×"
 * ("skip past onboarding entirely"). Matches the wireframes in the
 * "Wireframes for Quotable" Figma page. Both controls share the splash
 * button's squish + haptic + sound feel so onboarding sounds consistent
 * throughout, not just on the big CTAs.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { OnboardingColors, Spacing } from '@/constants/theme';
import * as haptics from '@/lib/haptics';
import * as sound from '@/lib/sound';

type Props = {
  onBack?: () => void;
  onSkip: () => void;
};

export function SkipBackRow({ onBack, onSkip }: Props) {
  function handleBack() {
    haptics.tap();
    sound.squish();
    onBack?.();
  }

  function handleSkip() {
    haptics.tap();
    sound.squish();
    onSkip();
  }

  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Back">
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 6l-6 6 6 6"
              stroke={OnboardingColors.ink}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
      <Pressable
        onPress={handleSkip}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Skip onboarding">
        <Text style={styles.skip}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.two,
  },
  spacer: {
    width: 24,
    height: 24,
  },
  skip: {
    color: OnboardingColors.ink,
    fontSize: 26,
    lineHeight: 26,
    fontWeight: '300',
  },
});
