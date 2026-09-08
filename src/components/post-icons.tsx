/**
 * Simple line icons for the post detail overlay's engagement row (heart /
 * comment / share) and its back arrow — plain react-native-svg glyphs,
 * matching the same crisp style as `tab-icons.tsx`.
 */
import Svg, { Path } from 'react-native-svg';

type Props = { color: string; size?: number };

export function BackArrowIcon({ color, size = 22 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M15 5 L8 12 L15 19"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/** Outline by default; pass `filled` once liked for a solid heart. */
export function HeartIcon({ color, size = 24, filled = false }: Props & { filled?: boolean }) {
  const d = 'M12 20.5 C7 16.8 3 13.4 3 9.2 C3 6.3 5.3 4 8.2 4 C9.9 4 11.3 4.8 12 6 C12.7 4.8 14.1 4 15.8 4 C18.7 4 21 6.3 21 9.2 C21 13.4 17 16.8 12 20.5 Z';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d={d}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}

export function CommentIcon({ color, size = 22 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 5 L20 5 L20 16 L10 16 L5 20 L5 16 L4 16 Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export function ShareIcon({ color, size = 22 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 4 L12 15 M7 9 L12 4 L17 9 M5 14 L5 19 L19 19 L19 14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
