/**
 * Onboarding v4, step 5 — sets expectations for what's in the app: a row of
 * hand-drawn icons (wallpaper maker, music note, chess piece, mountain
 * climber) under the welcome header, matching the wireframe spec.
 */
import { StyleSheet, View } from 'react-native';

import { OnboardingScaffold } from '@/components/onboarding/onboarding-scaffold';
import { OnboardingPill } from '@/components/onboarding/onboarding-pill';
import { ExpectationsIcons } from '@/components/onboarding/stick-art';
import { Spacing } from '@/constants/theme';

type Props = {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
};

export function ExpectationsStep({ onNext, onBack, onSkip }: Props) {
  return (
    <OnboardingScaffold
      onBack={onBack}
      onSkip={onSkip}
      contentAlign="center"
      title="We're honored to be a part of your first step towards being Quotable. Here you'll find a place of extraordinary people, places, and things around the world."
      footer={<OnboardingPill label="next" onPress={onNext} />}>
      <View style={styles.icons}>
        <ExpectationsIcons />
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  icons: {
    width: '100%',
    marginTop: Spacing.four,
  },
});
