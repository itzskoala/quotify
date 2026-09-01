/**
 * Onboarding v3 opening — the core-value screen. Headline + subtext are
 * written as a benefit ("what this does for you"), not a feature list — the
 * app teaches one line a day, not a feature tour. Not a numbered step (no
 * progress dots): a calm beat before personalization/paywall/account/notify.
 */
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Illustration } from '@/components/onboarding/illustrations';
import { OnboardingPill } from '@/components/onboarding/onboarding-pill';
import { ThemedText } from '@/components/themed-text';
import { BrandFonts, OnboardingColors, Spacing } from '@/constants/theme';

export function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Illustration name="welcome" size={160} />
          <ThemedText style={styles.headline}>Daily Wisdom for Your Mind.</ThemedText>
          <ThemedText style={styles.sub}>
            One line, once a day — enough to change how the next hour feels.
            No feed to keep up with, no streaks to protect. Just the words
            you need, when you need them.
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <OnboardingPill label="begin" onPress={onNext} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: OnboardingColors.bg },
  safe: { flex: 1, paddingHorizontal: Spacing.five },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  headline: {
    fontFamily: BrandFonts.urbanistBold,
    color: OnboardingColors.ink,
    fontSize: 30,
    lineHeight: 37,
    textAlign: 'center',
  },
  sub: {
    fontFamily: BrandFonts.urbanist,
    color: OnboardingColors.inkDim,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    paddingHorizontal: Spacing.two,
    marginTop: Spacing.two,
  },
  footer: {
    paddingBottom: Spacing.four,
  },
});
