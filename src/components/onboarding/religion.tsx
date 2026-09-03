/**
 * Onboarding v4, branch off Interests when "Religion" is selected. Matches
 * "03a — Religion (branch)" in the Wireframes for Quotable Figma page: a
 * single-select vertical list with an emoji per practice.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { OnboardingScaffold } from '@/components/onboarding/onboarding-scaffold';
import { OnboardingPill } from '@/components/onboarding/onboarding-pill';
import { BrandFonts, OnboardingColors, Spacing } from '@/constants/theme';
import * as haptics from '@/lib/haptics';
import * as sound from '@/lib/sound';

const PRACTICES = [
  { id: 'hinduism', emoji: '🕉️', label: 'Hinduism' },
  { id: 'buddhism', emoji: '☸️', label: 'Buddhism' },
  { id: 'islam', emoji: '☪️', label: 'Islam' },
  { id: 'christianity', emoji: '✝️', label: 'Christianity' },
  { id: 'judaism', emoji: '✡️', label: 'Judaism' },
  { id: 'sikhism', emoji: '🪯', label: 'Sikhism' },
  { id: 'spiritual', emoji: '🌌', label: 'Spiritual, not religious' },
  { id: 'prefer_not_to_say', emoji: '🤍', label: 'Prefer not to say' },
] as const;

export type ReligiousPractice = (typeof PRACTICES)[number]['id'];

type Props = {
  onNext: (practice: ReligiousPractice | null) => void;
  onBack: () => void;
  onSkip: () => void;
};

export function ReligionStep({ onNext, onBack, onSkip }: Props) {
  const [selected, setSelected] = useState<ReligiousPractice | null>(null);

  function select(id: ReligiousPractice) {
    haptics.tap();
    sound.squish();
    setSelected(id);
  }

  return (
    <OnboardingScaffold
      onBack={onBack}
      onSkip={onSkip}
      title="What do you practice?"
      subtitle="So we can bring you words that actually fit your practice."
      footer={
        <OnboardingPill
          label={selected ? 'next' : 'skip for now'}
          variant={selected ? 'solid' : 'outline'}
          onPress={() => onNext(selected)}
        />
      }>
      <View style={styles.list}>
        {PRACTICES.map((p) => {
          const isSelected = selected === p.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => select(p.id)}
              style={[styles.row, isSelected && styles.rowSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}>
              <Text style={styles.emoji}>{p.emoji}</Text>
              <Text style={[styles.label, isSelected && styles.labelSelected]}>{p.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: 14,
    paddingHorizontal: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: OnboardingColors.line,
    backgroundColor: OnboardingColors.card,
  },
  rowSelected: {
    backgroundColor: OnboardingColors.ink,
    borderColor: OnboardingColors.ink,
  },
  emoji: {
    fontSize: 20,
  },
  label: {
    fontFamily: BrandFonts.googleSansMedium,
    fontSize: 15,
    color: OnboardingColors.ink,
  },
  labelSelected: {
    color: '#19191B',
  },
});
