/**
 * Renders a wallpaper recipe (a `Wallpaper`) as a composed canvas: a background
 * (picked photo, or a grayscale preset — solid / gradient / ruled / dotgrid)
 * with the quote lettered over it in Indie Flower. Used live in Studio and as
 * the thumbnail in Profile → Wallpapers.
 *
 * The canvas fills its parent, so wrap it in a view that sets the aspect ratio
 * (a phone is ~9:19.5) with `overflow: 'hidden'`.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, Pattern, Rect } from 'react-native-svg';

import { presetById } from '@/constants/library';
import type { Wallpaper } from '@/constants/quotable';
import { BrandFonts } from '@/constants/theme';

type Props = {
  wallpaper: Wallpaper;
  /** Smaller type + tighter padding, for grid thumbnails. */
  preview?: boolean;
};

const INK = { light: '#FFFFFF', dark: '#0A0A0A' } as const;

function Background({ wallpaper }: { wallpaper: Wallpaper }) {
  if (wallpaper.photoUri) {
    return (
      <>
        <Image source={{ uri: wallpaper.photoUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
        {/* legibility scrim, tuned to the chosen text colour */}
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: wallpaper.ink === 'light' ? 'rgba(0,0,0,0.38)' : 'rgba(255,255,255,0.34)' },
          ]}
        />
      </>
    );
  }

  const preset = presetById(wallpaper.presetId);
  const [a, b] = preset.colors;

  if (preset.kind === 'gradient') {
    return <LinearGradient colors={preset.colors} style={StyleSheet.absoluteFill} />;
  }

  if (preset.kind === 'ruled') {
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: a }]}>
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern id="ruled" patternUnits="userSpaceOnUse" width={40} height={34}>
              <Line x1={0} y1={33} x2={40} y2={33} stroke={b} strokeWidth={1.5} />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#ruled)" />
        </Svg>
      </View>
    );
  }

  if (preset.kind === 'dots') {
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: a }]}>
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern id="dots" patternUnits="userSpaceOnUse" width={26} height={26}>
              <Circle cx={4} cy={4} r={1.6} fill={b} />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#dots)" />
        </Svg>
      </View>
    );
  }

  // solid
  return <View style={[StyleSheet.absoluteFill, { backgroundColor: a }]} />;
}

export function WallpaperCanvas({ wallpaper, preview }: Props) {
  const color = INK[wallpaper.ink];
  const base = preview ? 13 : 30;
  const size = base * wallpaper.fontScale;
  const shadow =
    wallpaper.photoUri != null
      ? {
          textShadowColor: wallpaper.ink === 'light' ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 6,
        }
      : null;

  return (
    <View style={styles.root}>
      <Background wallpaper={wallpaper} />
      <View
        style={[
          styles.content,
          { padding: preview ? 14 : 32, alignItems: wallpaper.align === 'left' ? 'flex-start' : 'center' },
        ]}>
        <View
          accessible
          accessibilityLabel={`Wallpaper quote: ${wallpaper.text}`}
          style={{ alignItems: wallpaper.align === 'left' ? 'flex-start' : 'center' }}>
          <WText
            text={wallpaper.text}
            color={color}
            size={size}
            align={wallpaper.align}
            shadow={shadow}
          />
          {wallpaper.author ? (
            <WText
              text={`— ${wallpaper.author.toLowerCase()}`}
              color={color}
              size={preview ? 9 : 15}
              align={wallpaper.align}
              shadow={shadow}
              author
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

function WText({
  text,
  color,
  size,
  align,
  shadow,
  author,
}: {
  text: string;
  color: string;
  size: number;
  align: 'center' | 'left';
  shadow: object | null;
  author?: boolean;
}) {
  return (
    <Text
      style={[
        {
          fontFamily: author ? BrandFonts.sans : BrandFonts.hand,
          color,
          fontSize: size,
          lineHeight: author ? size * 1.4 : size * 1.22,
          textAlign: align,
          letterSpacing: author ? 1 : 0.3,
          marginTop: author ? 14 : 0,
          opacity: author ? 0.9 : 1,
        },
        shadow,
      ]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
