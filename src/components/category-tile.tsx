/**
 * The clean image/quote tile used inside a category view (after tapping a
 * topic in `TopicGrid`, or Following) — a `WallpaperCanvas` thumbnail with
 * just a "···" mark in the corner, no avatar or engagement chrome, matching
 * the reference screenshot's plain masonry-of-images look. Every post
 * (social-sourced or pin-sourced) renders the same way here; the full
 * quote — attribution, like/save/share, story — lives one tap away in
 * `PostDetailOverlay`.
 */
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { WallpaperCanvas } from '@/components/wallpaper-canvas';
import { aspectForQuote, wallpaperForQuote, type ExplorePost } from '@/lib/explore-feed';
import { type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';

type Props = {
  post: ExplorePost;
  onPress: () => void;
};

export function CategoryTile({ post, onPress }: Props) {
  const c = useBrand();
  const s = styles(c);
  const wallpaper = wallpaperForQuote(post.quote);
  const aspect = aspectForQuote(post.quote.id);

  return (
    <Pressable
      onPress={() => {
        haptics.soft();
        onPress();
      }}
      style={({ pressed }) => [s.card, { aspectRatio: aspect }, pressed && s.pressed]}>
      <WallpaperCanvas wallpaper={wallpaper} preview />
      <ThemedText style={s.more}>···</ThemedText>
    </Pressable>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    card: {
      borderRadius: 18,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: c.line,
    },
    pressed: {
      opacity: 0.9,
    },
    more: {
      position: 'absolute',
      top: 6,
      right: 10,
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
  });
