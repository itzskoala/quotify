/**
 * Hand-drawn line doodles, drawn programmatically with react-native-svg. Thin,
 * monochrome, off-white strokes — quiet marks, not illustrations. No image
 * assets needed; swap a case to change one.
 */
import Svg, { Circle, Path, G } from 'react-native-svg';

import { useBrand } from '@/hooks/use-brand';

export type DoodleName = 'breathe' | 'sprig' | 'underline' | 'spark';

type Props = {
  name: DoodleName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Doodle({ name, size = 88, color, strokeWidth = 1.75 }: Props) {
  const c = useBrand();
  const stroke = color ?? c.text;

  switch (name) {
    case 'breathe':
      // a calm circle with a small orbiting dot
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <Circle cx={50} cy={50} r={30} stroke={stroke} strokeWidth={strokeWidth} opacity={0.9} />
          <Circle cx={50} cy={50} r={40} stroke={stroke} strokeWidth={strokeWidth} opacity={0.25} />
          <Circle cx={50} cy={20} r={3.4} fill={stroke} />
        </Svg>
      );
    case 'sprig':
      // a minimal single-stem plant
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <G stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" fill="none">
            <Path d="M50 88 C50 60 50 44 50 30" />
            <Path d="M50 52 C40 50 33 44 31 34 C42 34 49 40 50 50" />
            <Path d="M50 44 C60 42 67 36 69 26 C58 26 51 32 50 42" />
            <Path d="M50 30 C50 24 53 19 59 16" />
          </G>
          <Circle cx={50} cy={28} r={2.6} fill={stroke} />
        </Svg>
      );
    case 'underline':
      // a hand-drawn underline stroke
      return (
        <Svg width={size} height={size * 0.16} viewBox="0 0 120 18" fill="none">
          <Path
            d="M4 11 C28 4 52 4 74 8 C88 10 100 12 116 7"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      );
    case 'spark':
      // a small four-point line spark
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <G stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round">
            <Path d="M50 22 L50 44" />
            <Path d="M50 56 L50 78" />
            <Path d="M22 50 L44 50" />
            <Path d="M56 50 L78 50" />
          </G>
        </Svg>
      );
  }
}
