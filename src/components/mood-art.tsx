/**
 * Custom hand-drawn line-art for each Explore mood board — the black-and-white
 * answer to Google Health's illustrated library cards. Bespoke SVG per mood, so
 * no image assets and it always matches the ink/paper theme.
 */
import Svg, { Circle, G, Line, Path, Polyline } from 'react-native-svg';

import type { MoodId } from '@/constants/library';
import { useBrand } from '@/hooks/use-brand';

type Props = { mood: MoodId; color?: string };

export function MoodArt({ mood, color }: Props) {
  const c = useBrand();
  const stroke = color ?? c.text;
  const common = {
    stroke,
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Svg width="100%" height="100%" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet">
      <G {...common}>{ART[mood](stroke)}</G>
    </Svg>
  );
}

const ART: Record<MoodId, (stroke: string) => React.ReactNode> = {
  // a mountain with a summit flag + rising sun
  motivation: (stroke) => (
    <>
      <Circle cx={86} cy={34} r={12} opacity={0.6} />
      <Path d="M14 96 L48 40 L70 74" />
      <Path d="M56 60 L78 96" />
      <Path d="M8 96 L112 96" />
      <Path d="M48 40 L48 20" />
      <Path d="M48 22 L64 27 L48 33" fill={stroke} />
    </>
  ),
  // a dumbbell
  workout: (stroke) => (
    <>
      <Line x1={38} y1={60} x2={82} y2={60} />
      <Path d="M30 44 L30 76" />
      <Path d="M22 50 L22 70" />
      <Path d="M90 44 L90 76" />
      <Path d="M98 50 L98 70" />
      <Circle cx={38} cy={60} r={3} fill={stroke} stroke="none" />
      <Circle cx={82} cy={60} r={3} fill={stroke} stroke="none" />
    </>
  ),
  // two overlapping hearts
  romance: () => (
    <>
      <Path d="M50 84 C24 66 22 44 36 38 C46 34 50 42 52 48 C54 42 58 34 68 38 C82 44 76 66 50 84 Z" />
      <Path d="M78 58 C66 49 65 39 72 36 C77 34 79 38 80 41 C81 38 83 34 88 36 C95 39 92 49 80 58 Z" opacity={0.5} />
    </>
  ),
  // a burst / speed spiral (anime energy)
  anime: (stroke) => (
    <>
      <Path d="M60 60 C60 48 70 44 74 52 C78 62 66 74 52 72 C34 69 30 48 42 36 C56 22 84 26 96 44" />
      <Line x1={60} y1={18} x2={60} y2={30} />
      <Line x1={100} y1={60} x2={88} y2={60} />
      <Line x1={30} y1={92} x2={40} y2={82} />
      <Line x1={92} y1={92} x2={82} y2={82} />
      <Circle cx={60} cy={60} r={2.5} fill={stroke} stroke="none" />
    </>
  ),
  // a clapperboard
  movies: () => (
    <>
      <Path d="M22 52 L98 52 L98 92 L22 92 Z" />
      <Path d="M22 52 L30 38 L106 38 L98 52 Z" />
      <Line x1={40} y1={38} x2={34} y2={52} />
      <Line x1={58} y1={38} x2={52} y2={52} />
      <Line x1={76} y1={38} x2={70} y2={52} />
      <Line x1={94} y1={38} x2={88} y2={52} />
    </>
  ),
  // a crescent moon + stars
  calm: (stroke) => (
    <>
      <Path d="M74 30 C58 30 46 44 46 62 C46 80 58 92 74 92 C64 88 56 76 56 62 C56 48 64 36 74 30 Z" />
      <Path d="M34 40 L34 52 M28 46 L40 46" />
      <Circle cx={40} cy={78} r={2} fill={stroke} stroke="none" />
      <Circle cx={86} cy={54} r={2} fill={stroke} stroke="none" />
    </>
  ),
  // an open book
  wisdom: () => (
    <>
      <Path d="M60 40 C50 32 34 32 24 36 L24 84 C34 80 50 80 60 88" />
      <Path d="M60 40 C70 32 86 32 96 36 L96 84 C86 80 70 80 60 88" />
      <Line x1={60} y1={40} x2={60} y2={88} />
      <Polyline points="32,50 50,48" opacity={0.6} />
      <Polyline points="70,48 88,50" opacity={0.6} />
      <Polyline points="32,62 50,60" opacity={0.6} />
      <Polyline points="70,60 88,62" opacity={0.6} />
    </>
  ),
};
