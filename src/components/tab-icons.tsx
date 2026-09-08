/**
 * Simple line icons for the web tab bar (`app-tabs.web.tsx`) — native gets
 * real SF Symbols via `NativeTabs.Trigger.Icon`, but web has no equivalent,
 * so these fill in with plain react-native-svg glyphs matching the same
 * house/magnifying-glass/wand marks.
 */
import Svg, { Circle, Path } from 'react-native-svg';

type Props = { color: string; size?: number };

const common = {
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

export function HomeIcon({ color, size = 22 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 11 L12 4 L20 11" stroke={color} {...common} />
      <Path d="M6 9.5 L6 20 L18 20 L18 9.5" stroke={color} {...common} />
    </Svg>
  );
}

export function ExploreIcon({ color, size = 22 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={11} cy={11} r={7} stroke={color} {...common} />
      <Path d="M16.3 16.3 L21 21" stroke={color} {...common} />
    </Svg>
  );
}

export function WallpaperIcon({ color, size = 22 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 3 L14 9 L20 11 L14 13 L12 19 L10 13 L4 11 L10 9 Z" stroke={color} {...common} />
    </Svg>
  );
}
