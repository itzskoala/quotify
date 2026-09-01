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
  /** Urbanist — onboarding-only headline face. See OnboardingColors above for why it's scoped there. */
  urbanist: 'Urbanist_400Regular',
  urbanistSemiBold: 'Urbanist_600SemiBold',
  urbanistBold: 'Urbanist_700Bold',
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
 * Onboarding-only palette. Deliberately separate from `Palette` above:
 * the rest of the app stays strict black-and-white (see the comment on
 * `Palette`) while onboarding — a mental-health app's first impression —
 * gets a warm, bright, illustrated welcome instead. Retheming the rest of
 * the app to match is an explicit future task, not implied by this export.
 *
 * Kept to a cream/white base rather than full-bleed saturated color per
 * screen, so body text stays legible and the UI reads as "minimalist with
 * soft typography" — the color lives in illustrations, pill buttons, and
 * progress dots, one accent per question (see ONBOARDING_ACCENTS below).
 */
export type OnboardingPalette = {
  bg: string;
  card: string;
  ink: string;
  inkDim: string;
  line: string;
  coral: string;
  sunflower: string;
  sage: string;
  lavender: string;
};

export const OnboardingColors: OnboardingPalette = {
  bg: '#FFF8F0', // warm cream
  card: '#FFFFFF',
  ink: '#3A2E2A', // warm dark brown — softer than pure black
  inkDim: '#8B7E78',
  line: '#F0E4D8',
  coral: '#FF8B6A',
  sunflower: '#FFC857',
  sage: '#8FAE8B',
  lavender: '#B7A6E0',
};

/** One accent color per onboarding question, rotating through the palette. */
export const ONBOARDING_ACCENTS = [
  OnboardingColors.coral,
  OnboardingColors.sunflower,
  OnboardingColors.sage,
  OnboardingColors.lavender,
] as const;

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
