/**
 * Onboarding v4, step 4 — "How old are you?" A single slider from 16 to
 * 75+ (76 on the scale reads as "75+"). No separate "Age" screen existed in
 * onboarding v3; this is new for v4, matching the wireframe spec exactly.
 */
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OnboardingScaffold } from '@/components/onboarding/onboarding-scaffold';
import { OnboardingPill } from '@/components/onboarding/onboarding-pill';
import { BrandFonts, OnboardingColors, Spacing } from '@/constants/theme';
import * as haptics from '@/lib/haptics';

const MIN_AGE = 16;
const MAX_AGE = 76; // 76 displays as "75+"

function formatAge(value: number): string {
  return value >= MAX_AGE ? '75+' : String(value);
}

type Props = {
  onNext: (age: number) => void;
  onBack: () => void;
  onSkip: () => void;
};

export function AgeStep({ onNext, onBack, onSkip }: Props) {
  const [age, setAge] = useState(25);

  return (
    <OnboardingScaffold
      onBack={onBack}
      onSkip={onSkip}
      contentAlign="center"
      title="How old are you?"
      subtitle="Helps us keep the words age-appropriate."
      footer={<OnboardingPill label="next" onPress={() => onNext(age)} />}>
      <View style={styles.wrap}>
        <Text style={styles.value}>{formatAge(age)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={MIN_AGE}
          maximumValue={MAX_AGE}
          step={1}
          value={age}
          onValueChange={(v) => {
            if (Math.round(v) !== age) haptics.tap();
            setAge(Math.round(v));
          }}
          minimumTrackTintColor={OnboardingColors.ink}
          maximumTrackTintColor={OnboardingColors.line}
          thumbTintColor={OnboardingColors.ink}
        />
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabel}>16</Text>
          <Text style={styles.rangeLabel}>75+</Text>
        </View>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
  },
  value: {
    fontFamily: BrandFonts.googleSansBold,
    fontSize: 56,
    color: OnboardingColors.ink,
    marginBottom: Spacing.five,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeLabels: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.one,
  },
  rangeLabel: {
    fontFamily: BrandFonts.sans,
    fontSize: 13,
    color: OnboardingColors.inkFaint,
  },
});
