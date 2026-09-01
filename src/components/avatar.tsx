/**
 * A monochrome avatar. Shows a picked photo when `uri` is set, otherwise a
 * clean monogram (initials) on a bordered circle. Used for the user, creators,
 * and story portraits.
 */
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BrandFonts, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';

type Props = {
  name: string;
  uri?: string | null;
  size?: number;
  /** Fill the monogram with ink instead of an outline. */
  filled?: boolean;
};

function initials(name: string): string {
  const parts = name.replace(/^@/, '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, uri, size = 44, filled }: Props) {
  const c = useBrand();
  const s = styles(c);
  const round = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (uri) {
    return <Image source={{ uri }} style={[round, s.image]} contentFit="cover" />;
  }

  return (
    <View style={[round, s.mono, filled && s.monoFilled]}>
      <ThemedText
        style={[
          s.initials,
          { fontSize: size * 0.38, color: filled ? c.onAccent : c.text },
        ]}>
        {initials(name)}
      </ThemedText>
    </View>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    image: {
      backgroundColor: c.raised,
      borderWidth: 1,
      borderColor: c.line,
    },
    mono: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.raised,
      borderWidth: 1,
      borderColor: c.text,
    },
    monoFilled: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    initials: {
      fontFamily: BrandFonts.sansMedium,
      letterSpacing: 0.5,
    },
  });
