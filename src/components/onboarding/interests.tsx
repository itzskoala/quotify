/**
 * Onboarding v4, step 3 — "What inspires you?" Matches "03 — Interests" in
 * the Wireframes for Quotable Figma page: a 2x3 grid of topic chips
 * (deliberately a broader, more personal set than the app's quote-tone
 * MOODS — Politics/Religion aren't tones). Selecting "Religion" branches to
 * the practice sub-screen (see religion.tsx); every other selection maps to
 * the existing MoodId taxonomy via INTEREST_TO_MOOD so the live quote
 * generator's tone (MOOD_TO_TONE) still derives from what's picked here,
 * same as onboarding v3.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { OnboardingScaffold } from '@/components/onboarding/onboarding-scaffold';
import { OnboardingPill } from '@/components/onboarding/onboarding-pill';
import type { MoodId } from '@/constants/library';
import { BrandFonts, OnboardingColors, Spacing } from '@/constants/theme';
import * as haptics from '@/lib/haptics';
import * as sound from '@/lib/sound';

export type InterestId = 'sports' | 'meditation' | 'politics' | 'religion' | 'anime' | 'nature';

const INTERESTS: { id: InterestId; emoji: string; label: string }[] = [
  { id: 'sports', emoji: '🏈', label: 'Sports' },
  { id: 'meditation', emoji: '🧘', label: 'Meditation' },
  { id: 'politics', emoji: '🏛️', label: 'Politics' },
  { id: 'religion', emoji: '🙏', label: 'Religion' },
  { id: 'anime', emoji: '⛩️', label: 'Anime' },
  { id: 'nature', emoji: '🌿', label: 'Nature' },
];

/** Bridges the new interest taxonomy back onto the app's real MoodId/Tone system. */
export const INTEREST_TO_MOOD: Record<InterestId, MoodId> = {
  sports: 'workout',
  meditation: 'calm',
  politics: 'wisdom',
  religion: 'wisdom',
  anime: 'anime',
  nature: 'calm',
};

type Props = {
  onNext: (interests: InterestId[]) => void;
  onBack: () => void;
  onSkip: () => void;
};

export function InterestsStep({ onNext, onBack, onSkip }: Props) {
  const [selected, setSelected] = useState<InterestId[]>([]);

  function toggle(id: InterestId) {
    haptics.tap();
    sound.squish();
    setSelected((cur) => (cur.includes(id) ? cur.filter((i) => i !== id) : [...cur, id]));
  }

  return (
    <OnboardingScaffold
      onBack={onBack}
      onSkip={onSkip}
      title="What inspires you?"
      subtitle="Your answers will help us fine tune your experience."
      footer={
        <OnboardingPill
          label={selected.length ? 'continue' : 'skip for now'}
          variant={selected.length ? 'solid' : 'outline'}
          onPress={() => onNext(selected)}
        />
      }>
      <View style={styles.grid}>
        {INTERESTS.map((interest) => {
          const isSelected = selected.includes(interest.id);
          return (
            <Pressable
              key={interest.id}
              onPress={() => toggle(interest.id)}
              style={[styles.chip, isSelected && styles.chipSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}>
              <Text style={styles.emoji}>{interest.emoji}</Text>
              <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {interest.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingScaffold>
  );
}

const CHIP_GAP = Spacing.three;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CHIP_GAP,
    justifyContent: 'center',
  },
  chip: {
    width: '46%',
    aspectRatio: 163 / 92,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: OnboardingColors.line,
    backgroundColor: OnboardingColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  chipSelected: {
    backgroundColor: OnboardingColors.ink,
    borderColor: OnboardingColors.ink,
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    fontFamily: BrandFonts.googleSansMedium,
    fontSize: 14,
    color: OnboardingColors.ink,
  },
  labelSelected: {
    color: '#19191B',
  },
});
