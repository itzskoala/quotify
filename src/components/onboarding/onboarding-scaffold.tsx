/**
 * Shared frame for every onboarding v2 step: warm cream ground, an
 * illustration tied to the step's accent color, an Urbanist headline
 * (+ optional subtitle), a content area, and a pinned footer. Replaces
 * step-scaffold.tsx — only ever imported from within this directory, so
 * fully rewriting it is safe (confirmed via grep before this change).
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Illustration, type IllustrationName } from '@/components/onboarding/illustrations';
import { ThemedText } from '@/components/themed-text';
import { BrandFonts, OnboardingColors, Spacing } from '@/constants/theme';

type Props = {
  stepIndex: number;
  stepCount: number;
  title: string;
  subtitle?: string;
  illustration?: IllustrationName;
  /** Ties this step's progress dot + illustration accent together. */
  accent: string;
  children?: ReactNode;
  footer?: ReactNode;
};

export function OnboardingScaffold({
  stepIndex,
  stepCount,
  title,
  subtitle,
  illustration,
  accent,
  children,
  footer,
}: Props) {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.dots}>
          {Array.from({ length: stepCount }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === stepIndex && [styles.dotActive, { backgroundColor: accent }],
              ]}
            />
          ))}
        </View>

        <View style={styles.body}>
          {illustration ? (
            <View style={styles.illustration}>
              <Illustration name={illustration} accent={accent} size={140} />
            </View>
          ) : null}
          <ThemedText style={styles.title}>{title}</ThemedText>
          {subtitle ? <ThemedText style={styles.subtitle}>{subtitle}</ThemedText> : null}
          {children ? <View style={styles.content}>{children}</View> : null}
        </View>

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: OnboardingColors.bg,
  },
  safe: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    paddingTop: Spacing.four,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: OnboardingColors.line,
  },
  dotActive: {
    width: 18,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.three,
  },
  illustration: {
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  title: {
    fontFamily: BrandFonts.urbanistBold,
    color: OnboardingColors.ink,
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: BrandFonts.urbanist,
    color: OnboardingColors.inkDim,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: Spacing.two,
  },
  content: {
    marginTop: Spacing.two,
  },
  footer: {
    paddingBottom: Spacing.four,
    gap: Spacing.two,
  },
});
