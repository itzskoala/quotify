/**
 * Onboarding v4, step 2 — the value-prop beat between splash and
 * personalization. Matches "02 — Value Prop" in the Wireframes for Quotable
 * Figma page: the headline sentence + the hand-drawn book/sunflower/two-
 * stick-figures illustration.
 */
import { OnboardingScaffold } from '@/components/onboarding/onboarding-scaffold';
import { OnboardingPill } from '@/components/onboarding/onboarding-pill';
import { ValuePropIllustration } from '@/components/onboarding/stick-art';

type Props = {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
};

export function ValueProp({ onNext, onBack, onSkip }: Props) {
  return (
    <OnboardingScaffold
      onBack={onBack}
      onSkip={onSkip}
      contentAlign="center"
      title="You are the architect of your own private library of safe, uplifting words & inspiration that grows with you."
      footer={<OnboardingPill label="next" onPress={onNext} />}>
      <ValuePropIllustration size={260} />
    </OnboardingScaffold>
  );
}
