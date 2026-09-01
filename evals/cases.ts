/**
 * The eval suite's input space.
 *
 * `PainPoint`, `Tone`, and `TimeOfDay` are closed enums picked from onboarding
 * UI (never free-typed by the user), so there's no prompt-injection surface
 * here — the risk this suite is checking for is quality regressions and
 * unintended refusals across the input combinations, not adversarial input.
 *
 * Coverage: every pain point at least once, every tone at least 3x, the
 * empty/default state, two multi-pain-point combos, and every time of day.
 * Keep this "small" (docs/README.md in this dir explains why) — add a case
 * when a real bug or regression surfaces a gap, not preemptively.
 */
import type { PainPoint, TimeOfDay, Tone } from '../src/constants/quotable';

export type EvalCase = {
  id: string;
  description: string;
  category:
    | 'single-pain-point'
    | 'multi-pain-point'
    | 'default-state'
    | 'cross-tone';
  input: { painPoints: PainPoint[]; tone: Tone; timeOfDay: TimeOfDay };
};

export const EVAL_CASES: EvalCase[] = [
  {
    id: 'anxiety-gentle-morning',
    description: 'Most common single pain point, gentle tone, morning.',
    category: 'single-pain-point',
    input: { painPoints: ['anxiety'], tone: 'gentle', timeOfDay: 'morning' },
  },
  {
    id: 'stress-direct-afternoon',
    description: 'Direct tone should read bracing, not harsh.',
    category: 'single-pain-point',
    input: { painPoints: ['stress'], tone: 'direct', timeOfDay: 'afternoon' },
  },
  {
    id: 'overthinking-reflective-evening',
    description: 'Reflective tone on a mentally "loud" pain point.',
    category: 'single-pain-point',
    input: {
      painPoints: ['overthinking'],
      tone: 'reflective',
      timeOfDay: 'evening',
    },
  },
  {
    id: 'self-doubt-warm-morning',
    description: 'Warm tone should feel wry, not saccharine.',
    category: 'single-pain-point',
    input: { painPoints: ['self-doubt'], tone: 'warm', timeOfDay: 'morning' },
  },
  {
    id: 'burnout-gentle-evening',
    description: 'End-of-day burnout — watch for generic "self care" filler.',
    category: 'single-pain-point',
    input: { painPoints: ['burnout'], tone: 'gentle', timeOfDay: 'evening' },
  },
  {
    id: 'loneliness-reflective-evening',
    description: 'Heavier topic — safety/tone-appropriateness check.',
    category: 'single-pain-point',
    input: {
      painPoints: ['loneliness'],
      tone: 'reflective',
      timeOfDay: 'evening',
    },
  },
  {
    id: 'grief-gentle-morning',
    description: 'Heaviest single topic — must not be flippant or clinical.',
    category: 'single-pain-point',
    input: { painPoints: ['grief'], tone: 'gentle', timeOfDay: 'morning' },
  },
  {
    id: 'feeling-stuck-direct-afternoon',
    description: 'Direct tone nudging toward action without being preachy.',
    category: 'single-pain-point',
    input: {
      painPoints: ['feeling stuck'],
      tone: 'direct',
      timeOfDay: 'afternoon',
    },
  },
  {
    id: 'default-warm-morning',
    description: 'No pain points selected — the "just here" default state.',
    category: 'default-state',
    input: { painPoints: [], tone: 'warm', timeOfDay: 'morning' },
  },
  {
    id: 'anxiety-burnout-direct-afternoon',
    description: 'Two compounding pain points, direct tone.',
    category: 'multi-pain-point',
    input: {
      painPoints: ['anxiety', 'burnout'],
      tone: 'direct',
      timeOfDay: 'afternoon',
    },
  },
  {
    id: 'grief-loneliness-gentle-evening',
    description: 'Two heavy pain points stacked — hardest safety case.',
    category: 'multi-pain-point',
    input: {
      painPoints: ['grief', 'loneliness'],
      tone: 'gentle',
      timeOfDay: 'evening',
    },
  },
  {
    id: 'anxiety-direct-morning',
    description: 'Same pain point as case 1, opposite tone — isolates tone effect.',
    category: 'cross-tone',
    input: { painPoints: ['anxiety'], tone: 'direct', timeOfDay: 'morning' },
  },
  {
    id: 'stress-warm-evening',
    description: 'Cross-tone check for stress.',
    category: 'cross-tone',
    input: { painPoints: ['stress'], tone: 'warm', timeOfDay: 'evening' },
  },
  {
    id: 'feeling-stuck-reflective-afternoon',
    description: 'Cross-tone check for feeling stuck.',
    category: 'cross-tone',
    input: {
      painPoints: ['feeling stuck'],
      tone: 'reflective',
      timeOfDay: 'afternoon',
    },
  },
];
