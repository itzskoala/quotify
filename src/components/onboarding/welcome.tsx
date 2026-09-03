/**
 * Onboarding v4 opening — the splash. Not built on OnboardingScaffold (every
 * other step is): the header sits top-middle rather than under a shared
 * content column, and there's no back control (nothing to go back to). Only
 * a skip "×" top-right. Matches "01 — Splash" in the Wireframes for
 * Quotable Figma page.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingPill } from '@/components/onboarding/onboarding-pill';
import { SkipBackRow } from '@/components/onboarding/skip-back-row';
import { BrandFonts, MaxContentWidth, OnboardingColors, Spacing } from '@/constants/theme';

export function Welcome({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  return (
    <LinearGradient
      colors={OnboardingColors.gradientStops}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.55, 1]}
      style={styles.screen}>
      <SafeAreaView style={styles.safe}>
        <SkipBackRow onSkip={onSkip} />

        <View style={styles.hero}>
          <Text style={styles.headline}>quotable!</Text>
          <Text style={styles.sub}>your pocket cheerleader</Text>
        </View>

        <View style={styles.footer}>
          <OnboardingPill label="be quotable" onPress={onNext} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safe: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.five,
  },
  hero: {
    marginTop: Spacing.six,
    alignItems: 'center',
  },
  headline: {
    fontFamily: BrandFonts.googleSansBold,
    color: OnboardingColors.ink,
    fontSize: 40,
    textAlign: 'center',
  },
  sub: {
    fontFamily: BrandFonts.sans,
    color: OnboardingColors.inkDim,
    fontSize: 17,
    textAlign: 'center',
    marginTop: Spacing.three,
  },
  footer: {
    paddingBottom: Spacing.four,
  },
});
