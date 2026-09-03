/**
 * Onboarding v4, step 6 — "One quote a day keeps the inspiration at bay!"
 * Three mock push-notification cards sell the daily-notification feature:
 * a playful one (Saul Goodman — the fictional Breaking Bad/Better Call Saul
 * lawyer, a deliberate wink, not a real safety claim), a real, correctly-
 * attributed religious quote, and a real, correctly-attributed sports quote.
 */
import { StyleSheet, Text, View } from 'react-native';

import { OnboardingScaffold } from '@/components/onboarding/onboarding-scaffold';
import { OnboardingPill } from '@/components/onboarding/onboarding-pill';
import { BrandFonts, OnboardingColors, Spacing } from '@/constants/theme';

const NOTIFICATIONS = [
  {
    quote: 'Better call an Uber than call me. Don’t drink and drive.',
    author: 'Saul Goodman',
    time: 'now',
  },
  {
    quote: 'Peace comes from within. Do not seek it without.',
    author: 'Buddha',
    time: '9:00 AM',
  },
  {
    quote:
      'It isn’t the mountains ahead to climb that wear you out; it’s the pebble in your shoe.',
    author: 'Muhammad Ali',
    time: 'yesterday',
  },
];

type Props = {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
};

export function NotificationPreviewStep({ onNext, onBack, onSkip }: Props) {
  return (
    <OnboardingScaffold
      onBack={onBack}
      onSkip={onSkip}
      title="One quote a day keeps the inspiration at bay!"
      footer={<OnboardingPill label="next" onPress={onNext} />}>
      <View style={styles.stack}>
        {NOTIFICATIONS.map((n) => (
          <View key={n.author} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.appIcon}>
                <Text style={styles.appIconGlyph}>Q</Text>
              </View>
              <Text style={styles.appName}>Quotable</Text>
              <Text style={styles.time}>{n.time}</Text>
            </View>
            <Text style={styles.quote}>{n.quote}</Text>
            <Text style={styles.author}>— {n.author}</Text>
          </View>
        ))}
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  stack: {
    width: '100%',
    gap: Spacing.three,
  },
  card: {
    width: '100%',
    borderRadius: 18,
    padding: Spacing.three,
    backgroundColor: OnboardingColors.card,
    borderWidth: 1,
    borderColor: OnboardingColors.line,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  appIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: OnboardingColors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconGlyph: {
    fontFamily: BrandFonts.googleSansBold,
    fontSize: 12,
    color: '#19191B',
  },
  appName: {
    fontFamily: BrandFonts.googleSansMedium,
    fontSize: 12,
    color: OnboardingColors.inkDim,
    flex: 1,
  },
  time: {
    fontFamily: BrandFonts.sans,
    fontSize: 11,
    color: OnboardingColors.inkFaint,
  },
  quote: {
    fontFamily: BrandFonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: OnboardingColors.ink,
  },
  author: {
    fontFamily: BrandFonts.sans,
    fontSize: 12,
    color: OnboardingColors.inkFaint,
    marginTop: Spacing.one,
  },
});
