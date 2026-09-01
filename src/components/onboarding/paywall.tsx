/**
 * Onboarding v3 — subscription screen. UI-only mock by design (confirmed
 * with the user): "Continue" and "not now" both just advance the flow, no
 * real purchase, no App Store/Play product wiring, no RevenueCat. Real IAP
 * needs product config + a native dev build — separate, bigger effort.
 * Selected plan isn't persisted anywhere yet; wire that up when a real
 * purchase flow lands.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { OnboardingScaffold } from '@/components/onboarding/onboarding-scaffold';
import { OnboardingPill } from '@/components/onboarding/onboarding-pill';
import { ThemedText } from '@/components/themed-text';
import { BrandFonts, OnboardingColors, Spacing } from '@/constants/theme';
import * as haptics from '@/lib/haptics';

type Plan = 'weekly' | 'yearly';

const PLANS: Record<Plan, { price: string; period: string; note: string; badge?: string }> = {
  yearly: { price: '$39.99', period: '/ year', note: '3-day free trial, then $39.99/yr — under $3.50/mo', badge: 'best value' },
  weekly: { price: '$4.99', period: '/ week', note: 'cancel anytime' },
};

type Props = {
  stepIndex: number;
  stepCount: number;
  accent: string;
  onNext: () => void;
};

export function PaywallStep({ stepIndex, stepCount, accent, onNext }: Props) {
  const [plan, setPlan] = useState<Plan>('yearly');

  function choose(p: Plan) {
    haptics.soft();
    setPlan(p);
  }

  return (
    <OnboardingScaffold
      stepIndex={stepIndex}
      stepCount={stepCount}
      accent={accent}
      illustration="reading"
      title="never run out of the right words"
      subtitle="unlimited quotes tuned to you, every mood board, and a wallpaper studio for the lines worth keeping."
      footer={
        <View style={{ gap: Spacing.two }}>
          <OnboardingPill label="continue" accent={accent} onPress={onNext} />
          <Pressable onPress={onNext} hitSlop={8} style={styles.skip}>
            <ThemedText style={styles.skipLabel}>not now</ThemedText>
          </Pressable>
        </View>
      }>
      <View style={{ gap: Spacing.two }}>
        {(['yearly', 'weekly'] as Plan[]).map((p) => {
          const info = PLANS[p];
          const selected = plan === p;
          return (
            <Pressable
              key={p}
              onPress={() => choose(p)}
              style={[styles.card, selected && { borderColor: accent, backgroundColor: accent }]}>
              {info.badge ? (
                <View style={[styles.badge, { backgroundColor: selected ? OnboardingColors.card : accent }]}>
                  <ThemedText style={[styles.badgeLabel, { color: selected ? accent : OnboardingColors.card }]}>
                    {info.badge}
                  </ThemedText>
                </View>
              ) : null}
              <View style={styles.cardRow}>
                <ThemedText style={[styles.price, selected && styles.textSelected]}>
                  {info.price}
                  <ThemedText style={[styles.period, selected && styles.textSelected]}>{info.period}</ThemedText>
                </ThemedText>
                <View style={[styles.dot, selected && { backgroundColor: OnboardingColors.card, borderColor: OnboardingColors.card }]} />
              </View>
              <ThemedText style={[styles.note, selected && styles.textSelected]}>{info.note}</ThemedText>
            </Pressable>
          );
        })}
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderColor: OnboardingColors.line,
    backgroundColor: OnboardingColors.card,
    borderRadius: 18,
    padding: Spacing.three,
    gap: 4,
  },
  badge: {
    position: 'absolute',
    top: -10,
    left: Spacing.three,
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: Spacing.two,
  },
  badgeLabel: {
    fontFamily: BrandFonts.urbanistSemiBold,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontFamily: BrandFonts.urbanistBold,
    fontSize: 20,
    color: OnboardingColors.ink,
  },
  period: {
    fontFamily: BrandFonts.urbanist,
    fontSize: 13,
    color: OnboardingColors.inkDim,
  },
  textSelected: {
    color: OnboardingColors.card,
  },
  note: {
    fontFamily: BrandFonts.urbanist,
    fontSize: 12,
    color: OnboardingColors.inkDim,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: OnboardingColors.line,
  },
  skip: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  skipLabel: {
    fontFamily: BrandFonts.urbanistSemiBold,
    fontSize: 14,
    color: OnboardingColors.inkDim,
    textDecorationLine: 'underline',
  },
});
