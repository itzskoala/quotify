/**
 * Onboarding v3 — personalization. Tap-to-select pill grid over the app's
 * real mood taxonomy (MOODS in constants/library.ts) instead of a separate,
 * invented topic list — these are the same categories that already drive
 * Explore's mood board and the Studio wallpaper presets, so picking them
 * here is load-bearing (stored as `preferredMoods`, and the first pick sets
 * the live quote generator's tone via MOOD_TO_TONE) rather than decorative.
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { MoodChip } from '@/components/onboarding/mood-chip';
import { OnboardingScaffold } from '@/components/onboarding/onboarding-scaffold';
import { OnboardingPill } from '@/components/onboarding/onboarding-pill';
import { MOODS, type MoodId } from '@/constants/library';
import { Spacing } from '@/constants/theme';

type Props = {
  stepIndex: number;
  stepCount: number;
  accent: string;
  onNext: (moods: MoodId[]) => void;
};

export function CategoriesStep({ stepIndex, stepCount, accent, onNext }: Props) {
  const [selected, setSelected] = useState<MoodId[]>([]);

  function toggle(id: MoodId) {
    setSelected((cur) => (cur.includes(id) ? cur.filter((m) => m !== id) : [...cur, id]));
  }

  return (
    <OnboardingScaffold
      stepIndex={stepIndex}
      stepCount={stepCount}
      accent={accent}
      illustration="growing"
      title="what should find you first?"
      subtitle="pick a few — every quote after this leans toward them. change your mind anytime in Explore."
      footer={
        <OnboardingPill
          label={selected.length ? 'continue' : 'skip for now'}
          variant={selected.length ? 'solid' : 'outline'}
          accent={accent}
          onPress={() => onNext(selected)}
        />
      }>
      <View style={styles.grid}>
        {MOODS.map((mood) => (
          <MoodChip
            key={mood.id}
            label={mood.label}
            glyph={mood.glyph}
            selected={selected.includes(mood.id)}
            accent={accent}
            onPress={() => toggle(mood.id)}
          />
        ))}
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
