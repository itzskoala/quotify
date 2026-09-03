/**
 * Shared frame for every onboarding v4 step (splash excluded — it has its
 * own layout, see welcome.tsx): the charcoal-to-faded-grey gradient ground,
 * the back/skip row, a Google Sans Flex headline (+ optional Inter
 * subtitle), a content area, and a pinned footer. Rewritten from scratch for
 * the v4 monochrome redesign — see the comment on OnboardingColors in
 * src/constants/theme.ts.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { SkipBackRow } from '@/components/onboarding/skip-back-row';
import { ThemedText } from '@/components/themed-text';
import { BrandFonts, MaxContentWidth, OnboardingColors, Spacing } from '@/constants/theme';

type Props = {
  onBack?: () => void;
  onSkip: () => void;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  footer?: ReactNode;
  /** 'top' for content-heavy screens (lists, grids); 'center' for a single hero beat. */
  contentAlign?: 'top' | 'center';
};

export function OnboardingScaffold({
  onBack,
  onSkip,
  title,
  subtitle,
  children,
  footer,
  contentAlign = 'top',
}: Props) {
  return (
    <LinearGradient
      colors={OnboardingColors.gradientStops}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.55, 1]}
      style={styles.screen}>
      <SafeAreaView style={styles.safe}>
        <SkipBackRow onBack={onBack} onSkip={onSkip} />

        <View style={[styles.body, contentAlign === 'center' && styles.bodyCenter]}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          {subtitle ? <ThemedText style={styles.subtitle}>{subtitle}</ThemedText> : null}
          {children ? <View style={styles.content}>{children}</View> : null}
        </View>

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safe: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
  },
  body: {
    flex: 1,
    paddingTop: Spacing.five,
  },
  bodyCenter: {
    justifyContent: 'center',
  },
  title: {
    fontFamily: BrandFonts.googleSansSemiBold,
    color: OnboardingColors.ink,
    fontSize: 26,
    lineHeight: 33,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: BrandFonts.sans,
    color: OnboardingColors.inkDim,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    paddingHorizontal: Spacing.two,
    marginTop: Spacing.three,
  },
  content: {
    marginTop: Spacing.four,
    alignItems: 'center',
  },
  footer: {
    paddingBottom: Spacing.four,
    gap: Spacing.two,
  },
});
