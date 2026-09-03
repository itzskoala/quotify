/**
 * Onboarding v4: splash → value prop → interests → (religion practice, only
 * if "Religion" was picked) → age → expectations → notification preview →
 * CEO thank-you. Rebuilt from scratch for the v4 monochrome redesign — see
 * the comment on OnboardingColors in src/constants/theme.ts. Cuts v3's
 * paywall and account/login mock steps entirely (not just visually — the
 * screens themselves are deleted).
 *
 * Steps are a history stack rather than a fixed array index: the religion
 * branch means "back" doesn't always mean "index - 1", so we push/pop step
 * names instead of walking a flat STEP_ORDER like v3 did.
 *
 * On completion, calls completeOnboarding() (see providers/app-state.tsx),
 * which flips `onboarded` to true — _layout.tsx then unmounts this overlay
 * and the already-mounted <AppTabs/> shows straight through to Today. No
 * dedicated notify-time picker screen in v4 (cut along with paywall/account
 * — see the wireframe spec); the daily notification still gets scheduled,
 * just at DEFAULT_NOTIFY_TIME instead of a user-chosen time.
 */
import { useState } from 'react';

import { AgeStep } from '@/components/onboarding/age';
import { CtaThankYouStep } from '@/components/onboarding/cta-thankyou';
import { ExpectationsStep } from '@/components/onboarding/expectations';
import { INTEREST_TO_MOOD, InterestsStep, type InterestId } from '@/components/onboarding/interests';
import { NotificationPreviewStep } from '@/components/onboarding/notification-preview';
import { ReligionStep, type ReligiousPractice } from '@/components/onboarding/religion';
import { ValueProp } from '@/components/onboarding/value-prop';
import { Welcome } from '@/components/onboarding/welcome';
import { DEFAULT_NOTIFY_TIME } from '@/constants/quotable';
import * as sound from '@/lib/sound';
import { useAppState } from '@/providers/app-state';

type Step =
  | 'welcome'
  | 'value-prop'
  | 'interests'
  | 'religion'
  | 'age'
  | 'expectations'
  | 'notifications'
  | 'thankyou';

export function OnboardingFlow() {
  const { completeOnboarding } = useAppState();
  const [history, setHistory] = useState<Step[]>(['welcome']);
  const [interests, setInterests] = useState<InterestId[]>([]);
  const [religiousPractice, setReligiousPractice] = useState<ReligiousPractice | null>(null);
  const [age, setAge] = useState<number | undefined>(undefined);

  const step = history[history.length - 1];

  function goTo(next: Step) {
    setHistory((h) => [...h, next]);
  }

  function goBack() {
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  }

  async function finish() {
    sound.chime();
    const preferredMoods = [...new Set(interests.map((i) => INTEREST_TO_MOOD[i]))];
    await completeOnboarding({
      painPoints: [],
      preferredMoods,
      notifyTime: DEFAULT_NOTIFY_TIME,
      religiousPractice: religiousPractice ?? undefined,
      age,
    });
  }

  switch (step) {
    case 'welcome':
      return <Welcome onNext={() => goTo('value-prop')} onSkip={finish} />;

    case 'value-prop':
      return <ValueProp onNext={() => goTo('interests')} onBack={goBack} onSkip={finish} />;

    case 'interests':
      return (
        <InterestsStep
          onBack={goBack}
          onSkip={finish}
          onNext={(picked) => {
            setInterests(picked);
            goTo(picked.includes('religion') ? 'religion' : 'age');
          }}
        />
      );

    case 'religion':
      return (
        <ReligionStep
          onBack={goBack}
          onSkip={finish}
          onNext={(practice) => {
            setReligiousPractice(practice);
            goTo('age');
          }}
        />
      );

    case 'age':
      return (
        <AgeStep
          onBack={goBack}
          onSkip={finish}
          onNext={(value) => {
            setAge(value);
            goTo('expectations');
          }}
        />
      );

    case 'expectations':
      return <ExpectationsStep onBack={goBack} onSkip={finish} onNext={() => goTo('notifications')} />;

    case 'notifications':
      return (
        <NotificationPreviewStep onBack={goBack} onSkip={finish} onNext={() => goTo('thankyou')} />
      );

    case 'thankyou':
      return <CtaThankYouStep onBack={goBack} onDone={finish} />;
  }
}
