/**
 * Explore — Quotable's center of gravity. Two screens in one:
 *
 * 1. **Landing** — just the "Browse by category" tile grid. This is the
 *    whole of what you see on first open.
 * 2. **Category view** — after picking a topic, a clean Pinterest-style
 *    masonry of quote tiles for that selection, with a bare back arrow +
 *    the category name tucked top-left. No search bar or Following toggle
 *    in the UI right now (both cut "for now", not deleted — `filterExplorePosts`
 *    still takes a query/followingOnly, `FollowingEmpty` below is still
 *    reachable by re-wiring `selection` to `{ kind: 'following' }` from
 *    somewhere once there's a UI entry point for it again).
 *
 * (Route file kept as `explore` to match the tab config.)
 */
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { BackButton } from '@/components/back-button';
import { CategoryTile } from '@/components/category-tile';
import { Pill } from '@/components/pill';
import { PostDetailOverlay } from '@/components/post-detail-overlay';
import { QuoteMasonry } from '@/components/quote-masonry';
import { ThemedText } from '@/components/themed-text';
import { TopicGrid } from '@/components/topic-grid';
import { CREATORS } from '@/constants/library';
import { TOPICS, type TopicId } from '@/constants/topics';
import {
  BottomTabInset,
  BrandFonts,
  MaxContentWidth,
  Spacing,
  type BrandPalette,
} from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';
import {
  aspectForQuote,
  buildExplorePosts,
  filterExplorePosts,
  type ExplorePost,
} from '@/lib/explore-feed';
import { openProfile } from '@/lib/profile-bus';
import { useAppState } from '@/providers/app-state';

const ALL_POSTS = buildExplorePosts();

function estimateHeight(post: ExplorePost): number {
  return 180 / aspectForQuote(post.quote.id);
}

/** What put you into the category view — a topic tile, or Following. Drives
 * the back-screen's title + subheader blurb. */
type Selection = { kind: 'topic'; id: TopicId; label: string; blurb: string } | { kind: 'following' };

export default function ExploreScreen() {
  const { profile, following, isFollowing, toggleFollow } = useAppState();
  const c = useBrand();
  const s = styles(c);

  const [selection, setSelection] = useState<Selection | null>(null);
  const [active, setActive] = useState<ExplorePost | null>(null);

  // Clearing the selection (the back button does this) returns to the
  // landing grid. No search bar for now, so this is the only way in.
  const browsing = selection !== null;
  const followingOnly = selection?.kind === 'following';
  const topic: TopicId = selection?.kind === 'topic' ? selection.id : 'for-you';

  const posts = useMemo(
    () =>
      filterExplorePosts(ALL_POSTS, {
        topic,
        query: '',
        followingOnly,
        isFollowing,
      }),
    [topic, followingOnly, isFollowing],
  );

  const showFollowingEmpty = followingOnly && following.length === 0;

  function goBack() {
    haptics.tap();
    setSelection(null);
  }

  const categoryTitle = selection?.kind === 'following' ? 'following' : (selection?.label.toLowerCase() ?? '');
  const categoryBlurb = selection?.kind === 'following' ? 'the people you follow' : (selection?.blurb ?? '');

  return (
    <View style={s.screen}>
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.header}>
          <View style={s.headerInner}>
            {browsing ? (
              <View style={s.categoryHead}>
                <BackButton onPress={goBack} />
                <View>
                  <ThemedText style={s.categoryTitle}>{categoryTitle}</ThemedText>
                  <ThemedText style={s.categoryBlurb}>{categoryBlurb}</ThemedText>
                </View>
              </View>
            ) : (
              <View style={s.headerTop}>
                <View>
                  <ThemedText style={s.title}>explore</ThemedText>
                  <ThemedText style={s.sub}>discover words worth remembering</ThemedText>
                </View>
                <Pressable
                  onPress={() => {
                    haptics.tap();
                    openProfile();
                  }}
                  hitSlop={10}>
                  <Avatar name={profile.username} uri={profile.avatarUri} size={34} />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <View style={s.contentInner}>
            {!browsing ? (
              <TopicGrid
                onSelect={(id) => {
                  const topic = TOPICS.find((t) => t.id === id);
                  setSelection({ kind: 'topic', id, label: topic?.label ?? id, blurb: topic?.blurb ?? '' });
                }}
              />
            ) : (
              <View style={s.feed}>
                {showFollowingEmpty ? (
                  <FollowingEmpty c={c} isFollowing={isFollowing} toggleFollow={toggleFollow} />
                ) : posts.length === 0 ? (
                  <ThemedText style={s.empty}>nothing here yet — try another category or search.</ThemedText>
                ) : (
                  <QuoteMasonry
                    items={posts}
                    keyExtractor={(p) => p.id}
                    estimateHeight={estimateHeight}
                    renderItem={(post) => (
                      <CategoryTile post={post} onPress={() => setActive(post)} />
                    )}
                  />
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {active ? <PostDetailOverlay post={active} onClose={() => setActive(null)} /> : null}
    </View>
  );
}

function FollowingEmpty({
  c,
  isFollowing,
  toggleFollow,
}: {
  c: BrandPalette;
  isFollowing: (id: string) => boolean;
  toggleFollow: (id: string) => void;
}) {
  const s = styles(c);
  return (
    <View style={s.followingEmpty}>
      <ThemedText style={s.followingEmptyTitle}>your following feed is quiet</ThemedText>
      <ThemedText style={s.followingEmptyText}>
        follow a few creators and their posts show up here.
      </ThemedText>
      <View style={s.followingList}>
        {CREATORS.map((cr) => {
          const follow = isFollowing(cr.id);
          return (
            <View key={cr.id} style={s.followingRow}>
              <Avatar name={cr.name} size={40} />
              <View style={s.followingRowText}>
                <ThemedText style={s.followingName}>{cr.name}</ThemedText>
                <ThemedText style={s.followingHandle}>{cr.handle}</ThemedText>
              </View>
              <Pill
                label={follow ? 'following' : '+ follow'}
                active={follow}
                onPress={() => {
                  haptics.tap();
                  toggleFollow(cr.id);
                }}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.bg,
    },
    safe: {
      flex: 1,
    },
    header: {
      alignItems: 'center',
      paddingTop: Spacing.four,
      // The header never scrolls — the feed scrolls past right underneath
      // it — so it needs its own permanent bottom breathing room, not just
      // a gap supplied by the scroll content's paddingTop, or a scrolled
      // card sitting flush against it reads as a spacing bug.
      paddingBottom: Spacing.two,
    },
    // Caps content width on wide/web viewports (same pattern as app-tabs.web
    // and onboarding) — without this, a wide window stretches the masonry
    // columns so far that an aspectRatio-sized pin card's centered quote
    // text can end up scrolled well past the visible viewport.
    headerInner: {
      width: '100%',
      maxWidth: MaxContentWidth,
      paddingHorizontal: Spacing.four,
      gap: Spacing.two,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    title: {
      fontFamily: BrandFonts.valleyBold,
      fontSize: 40,
      lineHeight: 46,
      color: c.text,
    },
    sub: {
      fontFamily: BrandFonts.valley,
      fontSize: 18,
      color: c.textDim,
      marginTop: Spacing.one,
    },
    // The same big-gray-circle back button used in PostDetailOverlay, plus
    // a proper heading for the category name — this is the page title now,
    // not a small corner label.
    categoryHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
    },
    categoryTitle: {
      fontFamily: BrandFonts.valleyBold,
      fontSize: 32,
      color: c.text,
      letterSpacing: 0.2,
    },
    categoryBlurb: {
      fontFamily: BrandFonts.valley,
      fontSize: 14,
      color: c.textDim,
      marginTop: Spacing.one,
    },
    scroll: {
      alignItems: 'center',
      paddingTop: Spacing.two,
      paddingBottom: BottomTabInset + Spacing.six,
    },
    contentInner: {
      width: '100%',
      maxWidth: MaxContentWidth,
      gap: Spacing.three,
    },
    feed: {
      paddingHorizontal: Spacing.two,
    },
    empty: {
      fontFamily: BrandFonts.valley,
      fontSize: 14,
      color: c.textDim,
      textAlign: 'center',
      paddingTop: Spacing.six,
    },
    followingEmpty: {
      alignItems: 'center',
      paddingTop: Spacing.four,
    },
    followingEmptyTitle: {
      fontFamily: BrandFonts.valleySemiBold,
      fontSize: 26,
      color: c.text,
      textAlign: 'center',
    },
    followingEmptyText: {
      fontFamily: BrandFonts.valley,
      fontSize: 14,
      lineHeight: 21,
      color: c.textDim,
      textAlign: 'center',
      marginTop: Spacing.two,
      marginBottom: Spacing.four,
    },
    followingList: {
      alignSelf: 'stretch',
      gap: Spacing.three,
    },
    followingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      padding: Spacing.three,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.line,
      backgroundColor: c.raised,
    },
    followingRowText: {
      flex: 1,
    },
    followingName: {
      fontFamily: BrandFonts.valleyMedium,
      fontSize: 20,
      color: c.text,
    },
    followingHandle: {
      fontFamily: BrandFonts.valley,
      fontSize: 12,
      color: c.textDim,
    },
  });
