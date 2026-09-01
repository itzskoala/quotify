/**
 * Onboarding v3: core value → personalization (moods) → paywall (mock) →
 * account (mock local sign-up/log-in) → notification time (wheel picker).
 * Replaces the old seven-question flow — see prompts/dev-log/ for the
 * redesign plan and reasoning. On completion it persists everything +
 * schedules the daily notification, which flips the app over to the main
 * tabs.
 */
import { useState } from 'react';

import { AccountStep } from '@/components/onboarding/account';
import { CategoriesStep } from '@/components/onboarding/categories';
import { NotifyTimeStep } from '@/components/onboarding/notify-time';
import { PaywallStep } from '@/components/onboarding/paywall';
import { Welcome } from '@/components/onboarding/welcome';
import type { MoodId } from '@/constants/library';
import type { NotifyTime } from '@/constants/quotable';
import { ONBOARDING_ACCENTS } from '@/constants/theme';
import * as sound from '@/lib/sound';
import { useAppState } from '@/providers/app-state';

type Step = 'welcome' | 'categories' | 'paywall' | 'account' | 'notify';

const STEP_ORDER: Exclude<Step, 'welcome'>[] = ['categories', 'paywall', 'account', 'notify'];
const STEP_COUNT = STEP_ORDER.length;

/** Rotates through ONBOARDING_ACCENTS so each step has its own color. */
function accentFor(step: Step): string {
  if (step === 'welcome') return ONBOARDING_ACCENTS[0];
  const index = STEP_ORDER.indexOf(step as Exclude<Step, 'welcome'>);
  return ONBOARDING_ACCENTS[index % ONBOARDING_ACCENTS.length];
}

export function OnboardingFlow() {
  const { completeOnboarding } = useAppState();
  const [step, setStep] = useState<Step>('welcome');
  const [preferredMoods, setPreferredMoods] = useState<MoodId[]>([]);

  const stepIndex = step === 'welcome' ? -1 : STEP_ORDER.indexOf(step);
  const accent = accentFor(step);

  switch (step) {
    case 'welcome':
      return <Welcome onNext={() => setStep('categories')} />;

    case 'categories':
      return (
        <CategoriesStep
          stepIndex={stepIndex}
          stepCount={STEP_COUNT}
          accent={accent}
          onNext={(moods) => {
            setPreferredMoods(moods);
            setStep('paywall');
          }}
        />
      );

    case 'paywall':
      return (
        <PaywallStep
          stepIndex={stepIndex}
          stepCount={STEP_COUNT}
          accent={accent}
          onNext={() => setStep('account')}
        />
      );

    case 'account':
      return (
        <AccountStep
          stepIndex={stepIndex}
          stepCount={STEP_COUNT}
          accent={accent}
          onNext={() => setStep('notify')}
        />
      );

    case 'notify':
      return (
        <NotifyTimeStep
          stepIndex={stepIndex}
          stepCount={STEP_COUNT}
          accent={accent}
          onDone={(time: NotifyTime) => {
            sound.chime();
            void completeOnboarding({ painPoints: [], preferredMoods, notifyTime: time });
          }}
        />
      );
  }
}
