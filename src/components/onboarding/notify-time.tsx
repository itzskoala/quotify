/**
 * Onboarding v3 — final step: pick when the daily quote notification fires,
 * via the wheel time picker (wheel-time-picker.tsx). Replaces the old
 * three-preset notify-setup.tsx. "Skip for now" still schedules at a sane
 * default (9:00 AM) so the retention hook stays on unless the OS permission
 * prompt itself is declined — same trust-building "skip doesn't mean off"
 * pattern as the rest of the flow.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { OnboardingScaffold } from '@/components/onboarding/onboarding-scaffold';
import { OnboardingPill } from '@/components/onboarding/onboarding-pill';
import { WheelTimePicker } from '@/components/onboarding/wheel-time-picker';
import { ThemedText } from '@/components/themed-text';
import { DEFAULT_NOTIFY_TIME, type NotifyTime } from '@/constants/quotable';
import { BrandFonts, OnboardingColors, Spacing } from '@/constants/theme';
import * as haptics from '@/lib/haptics';
import { requestNotificationPermission } from '@/lib/notifications';

type Props = {
  stepIndex: number;
  stepCount: number;
  accent: string;
  onDone: (time: NotifyTime) => void;
};

export function NotifyTimeStep({ stepIndex, stepCount, accent, onDone }: Props) {
  const [time, setTime] = useState<NotifyTime>(DEFAULT_NOTIFY_TIME);
  const [busy, setBusy] = useState(false);

  async function finish(chosen: NotifyTime) {
    setBusy(true);
    await requestNotificationPermission();
    haptics.success();
    onDone(chosen);
  }

  return (
    <OnboardingScaffold
      stepIndex={stepIndex}
      stepCount={stepCount}
      accent={accent}
      illustration="resting"
      title="when do you need a boost the most?"
      subtitle="one quote a day, right when it helps most.">
      <View style={{ gap: Spacing.four }}>
        <WheelTimePicker value={time} onChange={setTime} accent={accent} />
        <View style={{ gap: Spacing.two }}>
          <OnboardingPill
            label={busy ? 'setting up…' : 'set reminder'}
            accent={accent}
            onPress={() => finish(time)}
            disabled={busy}
          />
          <Pressable onPress={() => finish(DEFAULT_NOTIFY_TIME)} hitSlop={8} style={styles.skip}>
            <ThemedText style={styles.skipLabel}>skip for now</ThemedText>
          </Pressable>
        </View>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
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
