/**
 * Onboarding v4, final screen — the "hey, it's the Quotable CEO" thank-you.
 * "Be quotable!" here calls onDone, which onboarding-flow.tsx wires to
 * completeOnboarding() — _layout.tsx then unmounts the onboarding overlay
 * and the already-mounted <AppTabs/> (defaulting to Today) shows straight
 * through. No separate "route home" step needed.
 */
import { StyleSheet, Text, View } from 'react-native';

import { OnboardingScaffold } from '@/components/onboarding/onboarding-scaffold';
import { OnboardingPill } from '@/components/onboarding/onboarding-pill';
import { WavingFigure } from '@/components/onboarding/stick-art';
import { BrandFonts, OnboardingColors, Spacing } from '@/constants/theme';

type Props = {
  onDone: () => void;
  onBack: () => void;
};

export function CtaThankYouStep({ onDone, onBack }: Props) {
  return (
    <OnboardingScaffold
      onBack={onBack}
      onSkip={onDone}
      contentAlign="center"
      title="Hey! This is the Quotable CEO! Thank you so much for downloading our app."
      footer={<OnboardingPill label="be quotable!" onPress={onDone} />}>
      <View style={styles.avatarWrap}>
        <WavingFigure size={130} />
        <Text style={styles.signature}>— the Quotable team</Text>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  signature: {
    fontFamily: BrandFonts.sans,
    fontSize: 13,
    color: OnboardingColors.inkFaint,
  },
});
