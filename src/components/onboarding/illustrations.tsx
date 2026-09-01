/**
 * Onboarding-only illustrations — flat, rounded, bold-outline figures in the
 * "Corporate Memphis" style referenced during design (soft mental-health-app
 * illustration sets). Hand-drawn with react-native-svg primitives, same
 * technique as the shared <Doodle> component (src/components/doodle.tsx),
 * but scoped to this directory so Doodle and its other consumer
 * (paper-card.tsx) are untouched.
 *
 * Each illustration takes a single `accent` color (one of OnboardingColors,
 * see src/constants/theme.ts) so the figure can be recolored per question
 * without touching paths. Ink outlines are constant regardless of accent.
 */
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { OnboardingColors } from '@/constants/theme';

export type IllustrationName = 'welcome' | 'reflecting' | 'growing' | 'reading' | 'resting';

type Props = {
  name: IllustrationName;
  size?: number;
  /** Fill for clothing/props — defaults per illustration if omitted. */
  accent?: string;
};

const INK = OnboardingColors.ink;
const STROKE = 3;

export function Illustration({ name, size = 180, accent }: Props) {
  switch (name) {
    case 'welcome':
      return <Welcome size={size} accent={accent ?? OnboardingColors.coral} />;
    case 'reflecting':
      return <Reflecting size={size} accent={accent ?? OnboardingColors.lavender} />;
    case 'growing':
      return <Growing size={size} accent={accent ?? OnboardingColors.sage} />;
    case 'reading':
      return <Reading size={size} accent={accent ?? OnboardingColors.sunflower} />;
    case 'resting':
      return <Resting size={size} accent={accent ?? OnboardingColors.lavender} />;
  }
}

/** Person relaxed in a cozy armchair with a warm mug — the welcome screen. */
function Welcome({ size, accent }: { size: number; accent: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <Circle cx={100} cy={100} r={92} fill={OnboardingColors.card} opacity={0.6} />
      {/* armchair */}
      <Path
        d="M56 150 C56 108 70 92 100 92 C130 92 144 108 144 150 L144 168 L56 168 Z"
        fill={accent}
        stroke={INK}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <Path d="M50 150 L56 150 L56 168 L50 168 Z M144 150 L150 150 L150 168 L144 168 Z" fill={accent} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
      {/* head */}
      <Circle cx={100} cy={78} r={22} fill="#FFFFFF" stroke={INK} strokeWidth={STROKE} />
      <Path d="M91 80 Q95 84 99 80 M103 80 Q107 84 111 80" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      {/* body */}
      <Path
        d="M78 100 C78 96 84 92 100 92 C116 92 122 96 122 100 L124 140 L76 140 Z"
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      {/* mug */}
      <Path d="M132 122 L146 122 L144 136 L134 136 Z" fill={OnboardingColors.sunflower} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <Path d="M146 126 C152 126 152 134 146 134" stroke={INK} strokeWidth={2.2} fill="none" />
      <Path d="M136 116 C137 112 141 112 141 116" stroke={INK} strokeWidth={1.8} strokeLinecap="round" fill="none" />
      {/* small plant */}
      <G>
        <Path d="M54 140 L58 122" stroke={OnboardingColors.sage} strokeWidth={3} strokeLinecap="round" />
        <Path d="M54 130 C48 126 46 120 48 114 C56 116 58 122 56 128" fill={OnboardingColors.sage} />
      </G>
    </Svg>
  );
}

/** Cross-legged meditating figure, calm aura marks. */
function Reflecting({ size, accent }: { size: number; accent: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <Circle cx={100} cy={100} r={92} fill={OnboardingColors.card} opacity={0.6} />
      {/* aura sparkles */}
      <G stroke={accent} strokeWidth={2.4} strokeLinecap="round">
        <Path d="M60 60 L66 66 M136 58 L130 64 M150 96 L142 96" />
      </G>
      {/* crossed legs */}
      <Path
        d="M62 152 C62 138 80 132 100 132 C120 132 138 138 138 152 L138 158 L62 158 Z"
        fill={accent}
        stroke={INK}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      {/* body */}
      <Path
        d="M80 96 C80 88 88 82 100 82 C112 82 120 88 120 96 L124 136 L76 136 Z"
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      {/* arms resting on knees */}
      <Path d="M78 118 C68 122 62 130 64 140" stroke={INK} strokeWidth={STROKE} fill="none" strokeLinecap="round" />
      <Path d="M122 118 C132 122 138 130 136 140" stroke={INK} strokeWidth={STROKE} fill="none" strokeLinecap="round" />
      {/* head, closed eyes */}
      <Circle cx={100} cy={64} r={20} fill="#FFFFFF" stroke={INK} strokeWidth={STROKE} />
      <Path d="M91 65 Q95 68 99 65 M101 65 Q105 68 109 65" stroke={INK} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <Path d="M97 74 Q100 76 103 74" stroke={INK} strokeWidth={2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/** Kneeling figure tending a sprouting plant. */
function Growing({ size, accent }: { size: number; accent: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <Circle cx={100} cy={100} r={92} fill={OnboardingColors.card} opacity={0.6} />
      {/* pot */}
      <Path d="M108 148 L150 148 L144 174 L114 174 Z" fill={accent} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
      {/* sprout */}
      <Path d="M129 148 L129 118" stroke={OnboardingColors.sage} strokeWidth={3.4} strokeLinecap="round" />
      <Path d="M129 128 C118 124 114 114 118 104 C130 106 134 116 129 126" fill={OnboardingColors.sage} />
      <Path d="M129 122 C140 118 144 108 140 98 C128 100 124 110 129 120" fill={OnboardingColors.sage} opacity={0.85} />
      {/* kneeling figure */}
      <Path
        d="M40 172 C40 156 50 148 62 148 L78 148 C90 148 98 156 98 172 L98 176 L40 176 Z"
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <Path
        d="M46 108 C46 98 54 90 68 90 C82 90 90 98 90 108 L92 150 L44 150 Z"
        fill={accent}
        stroke={INK}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      {/* arm reaching to plant */}
      <Path d="M88 116 C100 118 110 122 112 132" stroke={INK} strokeWidth={STROKE} fill="none" strokeLinecap="round" />
      <Circle cx={112} cy={134} r={4} fill={INK} />
      <Circle cx={68} cy={72} r={19} fill="#FFFFFF" stroke={INK} strokeWidth={STROKE} />
      <Path d="M60 73 Q64 76 68 73 M72 73 Q76 76 80 73" stroke={INK} strokeWidth={2.2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/** Seated figure with an open book. */
function Reading({ size, accent }: { size: number; accent: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <Circle cx={100} cy={100} r={92} fill={OnboardingColors.card} opacity={0.6} />
      {/* knees up */}
      <Path
        d="M64 176 L64 146 C64 138 72 134 82 134 L118 134 C128 134 136 138 136 146 L136 176 Z"
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      {/* open book */}
      <Path d="M78 128 L100 122 L100 148 L78 154 Z" fill={accent} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <Path d="M122 128 L100 122 L100 148 L122 154 Z" fill={accent} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <Path d="M84 132 L94 129 M84 138 L94 136 M84 144 L94 142" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M116 132 L106 129 M116 138 L106 136 M116 144 L106 142" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      {/* torso */}
      <Path
        d="M76 100 C76 92 84 86 100 86 C116 86 124 92 124 100 L126 136 L74 136 Z"
        fill={accent}
        stroke={INK}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      {/* head */}
      <Circle cx={100} cy={70} r={20} fill="#FFFFFF" stroke={INK} strokeWidth={STROKE} />
      <Path d="M91 72 Q95 68 99 72 M101 72 Q105 68 109 72" stroke={INK} strokeWidth={2.2} strokeLinecap="round" fill="none" />
      <Path d="M96 80 Q100 82 104 80" stroke={INK} strokeWidth={2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/** Figure lying down hugging a pillow, crescent moon nearby — bedtime. */
function Resting({ size, accent }: { size: number; accent: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <Circle cx={100} cy={100} r={92} fill={OnboardingColors.card} opacity={0.6} />
      {/* moon + stars */}
      <Path d="M148 48 C142 48 138 53 138 60 C138 67 142 72 148 72 C144 68 143 56 148 48 Z" fill={OnboardingColors.sunflower} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M52 56 L54 61 L59 63 L54 65 L52 70 L50 65 L45 63 L50 61 Z" fill={OnboardingColors.sunflower} />
      {/* pillow */}
      <Ellipse cx={100} cy={148} rx={58} ry={30} fill={accent} stroke={INK} strokeWidth={STROKE} />
      <Path d="M70 138 C76 148 76 158 70 166 M130 138 C124 148 124 158 130 166" stroke={INK} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.5} />
      {/* body hugging pillow, cheek on top */}
      <Path
        d="M62 132 C62 118 78 110 100 110 C122 110 138 118 138 132 L138 146 L62 146 Z"
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <Circle cx={100} cy={104} r={20} fill="#FFFFFF" stroke={INK} strokeWidth={STROKE} />
      <Path d="M91 105 Q95 108 99 105 M101 105 Q105 108 109 105" stroke={INK} strokeWidth={2.2} strokeLinecap="round" fill="none" />
      <Path d="M96 113 Q100 115 104 113" stroke={INK} strokeWidth={1.8} strokeLinecap="round" fill="none" />
      {/* zzz */}
      <Path d="M126 76 L134 76 L126 84 L134 84" stroke={accent} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}
