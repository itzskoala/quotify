/**
 * Onboarding v3 — create account / log in. Backed by the local mock auth in
 * app-state.tsx (`signUp`/`logIn`) — there's no backend, so this is one
 * on-device account record, not a real authenticated session. Toggling to
 * "log in" matters for the dev "reset onboarding" flow in profile.tsx: it
 * clears onboarding flags but keeps the account, so the flow can be
 * exercised end-to-end without losing the account each time.
 */
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { OnboardingScaffold } from '@/components/onboarding/onboarding-scaffold';
import { OnboardingPill } from '@/components/onboarding/onboarding-pill';
import { ThemedText } from '@/components/themed-text';
import { BrandFonts, OnboardingColors, Spacing } from '@/constants/theme';
import * as haptics from '@/lib/haptics';
import { useAppState } from '@/providers/app-state';

type Mode = 'signup' | 'login';

type Props = {
  stepIndex: number;
  stepCount: number;
  accent: string;
  onNext: () => void;
};

export function AccountStep({ stepIndex, stepCount, accent, onNext }: Props) {
  const { signUp, logIn } = useAppState();
  const [mode, setMode] = useState<Mode>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isSignup = mode === 'signup';
  const canSubmit = email.trim().length > 2 && password.length > 0 && (!isSignup || name.trim().length > 0);

  async function handleSubmit() {
    if (!canSubmit || busy) return;
    setBusy(true);
    setError(null);
    const result = isSignup ? await signUp(name, email, password) : await logIn(email, password);
    setBusy(false);
    if (result.ok) {
      haptics.success();
      onNext();
    } else {
      setError(result.error);
    }
  }

  return (
    <OnboardingScaffold
      stepIndex={stepIndex}
      stepCount={stepCount}
      accent={accent}
      illustration="reflecting"
      title={isSignup ? 'what should we call you?' : 'welcome back'}
      subtitle={
        isSignup
          ? 'this stays on your device — it just makes the app feel like yours.'
          : 'log in to pick up where you left off.'
      }>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ gap: Spacing.two }}>
          {isSignup ? (
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="your name"
              placeholderTextColor={OnboardingColors.inkDim}
              autoCapitalize="words"
              autoFocus
              style={styles.input}
            />
          ) : null}
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email"
            placeholderTextColor={OnboardingColors.inkDim}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="password"
            placeholderTextColor={OnboardingColors.inkDim}
            secureTextEntry
            style={styles.input}
          />
          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

          <OnboardingPill
            label={busy ? '…' : isSignup ? 'create account' : 'log in'}
            accent={accent}
            onPress={handleSubmit}
            disabled={!canSubmit || busy}
          />

          <Pressable
            onPress={() => {
              setError(null);
              setMode(isSignup ? 'login' : 'signup');
            }}
            hitSlop={8}
            style={styles.toggle}>
            <ThemedText style={styles.toggleLabel}>
              {isSignup ? 'already have an account? log in' : 'new here? create an account'}
            </ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  input: {
    fontFamily: BrandFonts.urbanist,
    fontSize: 16,
    color: OnboardingColors.ink,
    borderWidth: 1.5,
    borderColor: OnboardingColors.line,
    backgroundColor: OnboardingColors.card,
    borderRadius: 14,
    paddingVertical: Spacing.three - 2,
    paddingHorizontal: Spacing.three,
  },
  error: {
    fontFamily: BrandFonts.urbanist,
    fontSize: 13,
    color: OnboardingColors.coral,
    textAlign: 'center',
  },
  toggle: {
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  toggleLabel: {
    fontFamily: BrandFonts.urbanistSemiBold,
    fontSize: 13,
    color: OnboardingColors.inkDim,
    textDecorationLine: 'underline',
  },
});
