/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Quotable's identity: ink on paper, drawn by hand. A strict black-and-white
 * palette — paper-white in light, pure ink in dark — where the accent is simply
 * the opposite of the background (black on white / white on black). The voice is
 * Indie Flower: a warm, handwritten line. Consume via the `useBrand()` hook so
 * screens follow the device scheme.
 */
export type BrandPalette = {
  bg: string;
  raised: string;
  raisedActive: string;
  line: string;
  text: string;
  textDim: string;
  textFaint: string;
  /** The ink accent — pure opposite of bg (primary actions, selection). */
  accent: string;
  /** Text/icon sitting on the accent. */
  onAccent: string;
  /** Faint wash for subtle selected states. */
  accentSoft: string;
  /** Mid-grey secondary mark. */
  butter: string;
  /** Soft-grey secondary mark. */
  sage: string;
};

export const Palette: { light: BrandPalette; dark: BrandPalette } = {
  light: {
    bg: '#FFFFFF', // paper white
    raised: '#FAFAFA',
    raisedActive: '#EFEFEF',
    line: '#E3E3E3',
    text: '#0A0A0A', // ink
    textDim: '#6B6B6B',
    textFaint: '#A6A6A6',
    accent: '#0A0A0A', // ink is the accent
    onAccent: '#FFFFFF',
    accentSoft: '#ECECEC',
    butter: '#8C8C8C',
    sage: '#B4B4B4',
  },
  dark: {
    bg: '#000000', // pure ink
    raised: '#131313',
    raisedActive: '#1F1F1F',
    line: '#2B2B2B',
    text: '#FAFAFA', // chalk
    textDim: '#9B9B9B',
    textFaint: '#5C5C5C',
    accent: '#FAFAFA', // chalk is the accent
    onAccent: '#000000',
    accentSoft: '#1F1F1F',
    butter: '#8C8C8C',
    sage: '#B4B4B4',
  },
};

/**
 * Google-font families loaded in the root layout via `useFonts`.
 * Indie Flower carries the whole handwritten identity (quotes, titles, most
 * copy). Inter is kept only for tiny functional labels where a handwriting
 * face would hurt legibility.
 */
export const BrandFonts = {
  /** Indie Flower — the handwritten signature voice. */
  hand: 'IndieFlower_400Regular',
  /** Display/quote face (now handwritten — same family as `hand`). */
  serif: 'IndieFlower_400Regular',
  serifItalic: 'IndieFlower_400Regular',
  /** Clean neutral sans (Inter) — micro UI labels + numerals. */
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  /** Urbanist — legacy onboarding-v3 headline face, kept only for reference. */
  urbanist: 'Urbanist_400Regular',
  urbanistSemiBold: 'Urbanist_600SemiBold',
  urbanistBold: 'Urbanist_700Bold',
  /**
   * Google Sans Flex — onboarding-v4 headline face (see OnboardingColors
   * below). Google open-sourced the variable "Google Sans Flex" onto Google
   * Fonts; plain "Google Sans" is still not publicly distributed.
   */
  googleSansMedium: 'GoogleSansFlex_500Medium',
  googleSansSemiBold: 'GoogleSansFlex_600SemiBold',
  googleSansBold: 'GoogleSansFlex_700Bold',
  /**
   * Valley Sans — Explore-only. Explore's own components (the screen,
   * TopicGrid, SearchBar, Pill, CategoryTile, PostDetailOverlay's chrome)
   * use these instead of `hand`/`sans` above; shared components Explore
   * merely reuses (`PaperCard`, `WallpaperCanvas`, `StoryOverlay`) are left
   * on the app-wide voice so Home/Studio/Profile don't also change.
   */
  valley: 'ValleySans_400Regular',
  valleyMedium: 'ValleySans_500Medium',
  valleySemiBold: 'ValleySans_600SemiBold',
  valleyBold: 'ValleySans_700Bold',
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

/**
 * Onboarding-only palette. Deliberately separate from `Palette` above (see
 * the comment on `Palette`) so the rest of the app is untouched.
 *
 * v4 (2026-09, monochrome experiment): replaces the v3 warm-cream/coral
 * palette below with a calm, muted charcoal-to-faded-grey — this is a
 * mental-health/quotes app, so onboarding should read as calming, not
 * stimulating. Explicitly scoped as an *experiment for onboarding only* —
 * it does not retheme the rest of the app, and the warm palette this
 * replaced is no longer the assumed eventual app-wide direction (that plan
 * is retired, not just paused). `gradientStops` feeds `expo-linear-gradient`
 * directly and is the one background treatment used across every screen —
 * a flat single tone reads static/lifeless at this size, the soft diagonal
 * blend is what makes it feel alive without introducing color.
 */
export type OnboardingPalette = {
  /** Solid fallback (web canvas capture, etc.) — mid-point of gradientStops. */
  bg: string;
  gradientStops: readonly [string, string, string];
  /** Translucent white — chip/row fills over the gradient. */
  card: string;
  /** Translucent white — chip/row borders over the gradient. */
  line: string;
  ink: string;
  inkDim: string;
  inkFaint: string;
};

export const OnboardingColors: OnboardingPalette = {
  bg: '#252528',
  gradientStops: ['#131315', '#252528', '#4D4D4F'],
  card: 'rgba(255,255,255,0.06)',
  line: 'rgba(255,255,255,0.22)',
  ink: '#FFFFFF',
  inkDim: '#C0C0C2',
  inkFaint: '#8A8A8D',
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 84 }) ?? 0;
export const MaxContentWidth = 800;
