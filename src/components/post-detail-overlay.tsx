/**
 * Tapping any card in Explore's masonry opens this — Pinterest's own post
 * view is the reference: the photo/quote fills nearly the whole screen in a
 * big rounded-corner frame, a translucent back arrow floats over its
 * top-left corner (not a separate bar taking its own space), an optional
 * caption sits under the account row, and the engagement row (like — hold
 * for a reaction picker — comment, share) sits grouped tightly on the left
 * with the lavender Favorite button pushed to the far right. Chains into
 * the existing `StoryOverlay` when the author has one.
 */
import { useState } from 'react';
import { Pressable, Share, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { BackButton } from '@/components/back-button';
import { FavoriteButton } from '@/components/favorite-button';
import { LikeHeart } from '@/components/like-heart';
import { PaperCard } from '@/components/paper-card';
import { CommentIcon, ShareIcon } from '@/components/post-icons';
import { QuoteActions } from '@/components/quote-actions';
import { StoryOverlay } from '@/components/story-overlay';
import { ThemedText } from '@/components/themed-text';
import { WallpaperCanvas } from '@/components/wallpaper-canvas';
import { storyFor, type Story } from '@/constants/library';
import { QUOTE_PHOTOS } from '@/constants/photos';
import { BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';
import { wallpaperForQuote, type ExplorePost } from '@/lib/explore-feed';

type Props = {
  post: ExplorePost;
  onClose: () => void;
};

export function PostDetailOverlay({ post, onClose }: Props) {
  const c = useBrand();
  const s = styles(c);
  const insets = useSafeAreaInsets();
  const [story, setStory] = useState<Story | null>(null);
  const authorStory = post.quote.hasStory ? storyFor(post.quote.author) : undefined;
  // Only decides which hero to render (a real photo background vs. plain
  // paper) — every post's account row below always uses `post.creator` now,
  // never photo-credit text (see `creatorForPin` in lib/explore-feed.ts).
  const photo = QUOTE_PHOTOS[post.quote.id];
  const caption = post.kind === 'social' ? post.caption : undefined;

  async function handleShare() {
    haptics.tap();
    const authorLine = post.quote.author ? ` — ${post.quote.author}` : '';
    await Share.share({ message: `${post.quote.text}${authorLine}\n\nvia Quotable` });
  }

  return (
    <View style={s.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[s.heroWrap, { paddingTop: insets.top + Spacing.three }]}>
          {photo ? (
            <View style={s.photoHero}>
              <WallpaperCanvas wallpaper={wallpaperForQuote(post.quote)} />
            </View>
          ) : (
            <SafeAreaView edges={['top']} style={s.paperHero}>
              <PaperCard quote={post.quote} />
            </SafeAreaView>
          )}
        </View>

        <View style={s.body}>
          <View style={s.poster}>
            <Pressable onPress={() => haptics.tap()} hitSlop={6}>
              <Avatar name={post.creator.name} size={40} />
            </Pressable>
            <View style={s.posterText}>
              <ThemedText style={s.posterName}>{post.creator.name}</ThemedText>
              <ThemedText style={s.posterHandle} numberOfLines={1}>
                {post.creator.bio}
              </ThemedText>
            </View>
          </View>

          {caption ? <ThemedText style={s.caption}>{caption}</ThemedText> : null}

          <View style={s.engagement}>
            <View style={s.engageLeft}>
              <LikeHeart quote={post.quote} count={post.likes} />
              <Pressable style={s.engageButton} hitSlop={8}>
                <CommentIcon color={c.textDim} />
                <ThemedText style={s.engageCount}>{post.comments}</ThemedText>
              </Pressable>
              <Pressable style={s.engageButton} onPress={handleShare} hitSlop={8}>
                <ShareIcon color={c.textDim} />
              </Pressable>
            </View>
            <FavoriteButton quote={post.quote} />
          </View>

          <View style={s.actions}>
            <QuoteActions
              quote={post.quote}
              onStory={authorStory ? () => setStory(authorStory) : undefined}
            />
          </View>
        </View>
      </ScrollView>

      {/* Floats over the image itself rather than taking its own bar. */}
      <BackButton onPress={onClose} style={[s.back, { top: insets.top + Spacing.two }]} />

      {story ? <StoryOverlay story={story} onClose={() => setStory(null)} /> : null}
    </View>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    screen: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: c.bg,
    },
    back: {
      position: 'absolute',
      left: Spacing.three,
      zIndex: 10,
    },
    // A big rounded-corner frame that dominates the screen — not literally
    // edge to edge (that read as a sharp-cornered full-bleed image, not the
    // Pinterest card look) — a small margin keeps the rounding visible.
    heroWrap: {
      paddingHorizontal: Spacing.three,
    },
    photoHero: {
      width: '100%',
      aspectRatio: 0.75,
      borderRadius: 24,
      overflow: 'hidden',
    },
    paperHero: {
      width: '100%',
      paddingVertical: Spacing.six,
    },
    body: {
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.three,
      paddingBottom: Spacing.six,
      gap: Spacing.two,
    },
    poster: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
      alignSelf: 'stretch',
    },
    posterText: {
      flexShrink: 1,
    },
    posterName: {
      fontFamily: BrandFonts.valleyMedium,
      fontSize: 14,
      color: c.text,
    },
    posterHandle: {
      fontFamily: BrandFonts.valley,
      fontSize: 12,
      color: c.textFaint,
    },
    caption: {
      fontFamily: BrandFonts.valley,
      fontSize: 14,
      lineHeight: 20,
      color: c.textDim,
    },
    // Heart/comment/share grouped tightly on the left; Favorite pushed all
    // the way to the right edge.
    engagement: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: Spacing.one,
    },
    engageLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.four,
    },
    engageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.one,
    },
    engageCount: {
      fontFamily: BrandFonts.valley,
      fontSize: 14,
      color: c.textDim,
    },
    actions: {
      marginTop: Spacing.two,
      alignItems: 'flex-start',
    },
  });
