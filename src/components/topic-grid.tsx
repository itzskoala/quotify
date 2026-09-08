/**
 * The "Browse by category" landing grid — the whole of what you see when
 * you first open Explore: every topic as a photo tile (all 8 have a real
 * cover now, see `constants/photos.ts`), wrapping to fill the width, with
 * the topic name in bold white text centered over the photo — per the
 * Pinterest category reference, not a corner label. Tapping a tile is how
 * you "go into" a category (see `explore.tsx`'s category view).
 */
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CATEGORY_COVERS } from '@/constants/photos';
import { TOPICS, type TopicId } from '@/constants/topics';
import { BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';

type Props = {
  onSelect: (id: TopicId) => void;
};

export function TopicGrid({ onSelect }: Props) {
  const c = useBrand();
  const s = styles(c);

  return (
    <View style={s.grid}>
      {TOPICS.map((topic) => {
        const cover = CATEGORY_COVERS[topic.id];
        return (
          <Pressable
            key={topic.id}
            onPress={() => {
              haptics.soft();
              onSelect(topic.id);
            }}
            style={({ pressed }) => [s.tile, pressed && s.pressed]}>
            {cover ? (
              <Image source={{ uri: cover.url }} style={StyleSheet.absoluteFill} contentFit="cover" />
            ) : (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: c.raisedActive }]} />
            )}
            {/* Flat wash, not just a bottom gradient — the label sits centered now,
                so it needs to read over any part of the photo, not just the bottom. */}
            <View style={[StyleSheet.absoluteFill, s.scrim]} pointerEvents="none" />
            <ThemedText style={s.label}>{topic.label}</ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: Spacing.two,
      paddingHorizontal: Spacing.two,
    },
    tile: {
      width: '48.5%',
      aspectRatio: 1.45,
      borderRadius: 16,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: c.line,
    },
    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
    scrim: {
      backgroundColor: 'rgba(0,0,0,0.32)',
    },
    label: {
      fontFamily: BrandFonts.valleyBold,
      fontSize: 24,
      textAlign: 'center',
      letterSpacing: 0.2,
      color: '#FFFFFF',
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
  });
