/**
 * Feed — a full-screen vertical snap-pager (think Reels): one quote post per
 * screen, scroll up for the next. Two lanes at the top: "For you" (everything)
 * and "Following" (only creators you follow). When a post's author has a life
 * worth reading, "story →" opens the story behind the person.
 */
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { PaperCard } from '@/components/paper-card';
import { QuoteActions } from '@/components/quote-actions';
import { StoryOverlay } from '@/components/story-overlay';
import { ThemedText } from '@/components/themed-text';
import {
  CREATORS,
  FEED,
  creatorById,
  libraryQuoteById,
  storyFor,
  type Creator,
  type FeedPost,
  type LibraryQuote,
  type Story,
} from '@/constants/library';
import { BottomTabInset, BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';
import { useAppState } from '@/providers/app-state';

type Lane = 'foryou' | 'following';

type Row = { post: FeedPost; creator: Creator; quote: LibraryQuote };

export default function FeedScreen() {
  const { following } = useAppState();
  const c = useBrand();
  const s = styles(c);
  const insets = useSafeAreaInsets();
  const [lane, setLane] = useState<Lane>('foryou');
  const [story, setStory] = useState<Story | null>(null);
  const [pageH, setPageH] = useState(0);

  const rows = useMemo<Row[]>(() => {
    const all = FEED.map((post) => ({
      post,
      creator: creatorById(post.creatorId),
      quote: libraryQuoteById(post.quoteId),
    })).filter((r): r is Row => Boolean(r.creator && r.quote));
    if (lane === 'following') return all.filter((r) => following.includes(r.post.creatorId));
    return all;
  }, [lane, following]);

  // Float the lane switch just below the top edge (tabs live at the bottom now).
  const tabsTop = insets.top + 8;
  const contentTop = tabsTop + 48;
  const contentBottom = insets.bottom + BottomTabInset + Spacing.three;

  return (
    <View
      style={s.screen}
      onLayout={(e) => setPageH(e.nativeEvent.layout.height)}>
      {pageH > 0 &&
        (rows.length > 0 ? (
          <FlatList
            key={lane}
            data={rows}
            keyExtractor={(r) => r.post.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={pageH}
            snapToAlignment="start"
            decelerationRate="fast"
            getItemLayout={(_, i) => ({ length: pageH, offset: pageH * i, index: i })}
            renderItem={({ item }) => (
              <Post
                row={item}
                height={pageH}
                topPad={contentTop}
                bottomPad={contentBottom}
                onStory={(st) => setStory(st)}
              />
            )}
          />
        ) : (
          <FollowingEmpty height={pageH} topPad={contentTop} />
        ))}

      {/* floating lane switch */}
      <View style={[s.lanes, { top: tabsTop }]} pointerEvents="box-none">
        <View style={s.laneGroup}>
          <LaneButton c={c} label="For you" active={lane === 'foryou'} onPress={() => setLane('foryou')} />
          <LaneButton
            c={c}
            label="Following"
            active={lane === 'following'}
            onPress={() => setLane('following')}
          />
        </View>
      </View>

      {story ? <StoryOverlay story={story} onClose={() => setStory(null)} /> : null}
    </View>
  );
}

function Post({
  row,
  height,
  topPad,
  bottomPad,
  onStory,
}: {
  row: Row;
  height: number;
  topPad: number;
  bottomPad: number;
  onStory: (story: Story) => void;
}) {
  const { post, creator, quote } = row;
  const c = useBrand();
  const s = styles(c);
  const st = quote.hasStory ? storyFor(quote.author) : undefined;
  const when = post.hoursAgo < 24 ? `${post.hoursAgo}h` : `${Math.round(post.hoursAgo / 24)}d`;

  return (
    <View style={{ height }}>
      <View style={[s.post, { paddingTop: topPad, paddingBottom: bottomPad }]}>
        <PostHeader creator={creator} when={when} />

        <View style={s.hero}>
          <PaperCard quote={quote} />
        </View>

        <View style={s.footer}>
          {post.caption ? <ThemedText style={s.caption}>{post.caption}</ThemedText> : null}
          <ThemedText style={s.likes}>♥ {post.likes.toLocaleString()}</ThemedText>
          <QuoteActions quote={quote} onStory={st ? () => onStory(st) : undefined} />
          <ThemedText style={s.swipeHint}>swipe up for the next ↑</ThemedText>
        </View>
      </View>
    </View>
  );
}

function PostHeader({ creator, when }: { creator: Creator; when: string }) {
  const { isFollowing, toggleFollow } = useAppState();
  const c = useBrand();
  const s = styles(c);
  const following = isFollowing(creator.id);
  return (
    <View style={s.postHeader}>
      <Avatar name={creator.name} size={40} />
      <View style={s.postHeaderText}>
        <ThemedText style={s.postName}>{creator.name}</ThemedText>
        <ThemedText style={s.postHandle}>
          {creator.handle} · {when}
        </ThemedText>
      </View>
      <Pressable
        onPress={() => {
          haptics.tap();
          toggleFollow(creator.id);
        }}
        hitSlop={8}
        style={[s.followSm, following && s.followSmOn]}>
        <ThemedText style={[s.followSmLabel, following && s.followSmLabelOn]}>
          {following ? 'following' : '+ follow'}
        </ThemedText>
      </Pressable>
    </View>
  );
}

function FollowingEmpty({ height, topPad }: { height: number; topPad: number }) {
  const { isFollowing, toggleFollow } = useAppState();
  const c = useBrand();
  const s = styles(c);
  return (
    <View style={{ height }}>
      <ScrollView contentContainerStyle={[s.emptyWrap, { paddingTop: topPad }]}>
        <ThemedText style={s.emptyTitle}>your following feed is quiet</ThemedText>
        <ThemedText style={s.emptyText}>
          follow a few creators and their posts show up here.
        </ThemedText>
        <View style={s.emptyList}>
          {CREATORS.map((cr) => {
            const following = isFollowing(cr.id);
            return (
              <View key={cr.id} style={s.emptyRow}>
                <Avatar name={cr.name} size={44} />
                <View style={s.emptyRowText}>
                  <ThemedText style={s.postName}>{cr.name}</ThemedText>
                  <ThemedText style={s.postHandle}>{cr.handle}</ThemedText>
                </View>
                <Pressable
                  onPress={() => {
                    haptics.tap();
                    toggleFollow(cr.id);
                  }}
                  style={[s.followSm, following && s.followSmOn]}>
                  <ThemedText style={[s.followSmLabel, following && s.followSmLabelOn]}>
                    {following ? 'following' : '+ follow'}
                  </ThemedText>
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

function LaneButton({
  c,
  label,
  active,
  onPress,
}: {
  c: BrandPalette;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const s = styles(c);
  return (
    <Pressable
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      style={[s.lane, active && s.laneOn]}>
      <ThemedText style={[s.laneLabel, active && s.laneLabelOn]}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },

    lanes: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    laneGroup: {
      flexDirection: 'row',
      gap: Spacing.one,
      padding: Spacing.half,
      borderRadius: 999,
      backgroundColor: c.raised,
      borderWidth: 1,
      borderColor: c.line,
    },
    lane: {
      paddingVertical: Spacing.two - 1,
      paddingHorizontal: Spacing.four,
      borderRadius: 999,
    },
    laneOn: {
      backgroundColor: c.accent,
    },
    laneLabel: {
      fontFamily: BrandFonts.sansMedium,
      fontSize: 14,
      color: c.textDim,
    },
    laneLabelOn: {
      color: c.onAccent,
    },

    post: {
      flex: 1,
      paddingHorizontal: Spacing.four,
      justifyContent: 'space-between',
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
    },
    postHeaderText: {
      flex: 1,
    },
    postName: {
      fontFamily: BrandFonts.hand,
      fontSize: 20,
      color: c.text,
    },
    postHandle: {
      fontFamily: BrandFonts.sans,
      fontSize: 12,
      color: c.textDim,
    },
    followSm: {
      paddingVertical: Spacing.one,
      paddingHorizontal: Spacing.three,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.line,
    },
    followSmOn: {
      borderColor: c.accent,
      backgroundColor: c.accent,
    },
    followSmLabel: {
      fontFamily: BrandFonts.sansMedium,
      fontSize: 12,
      color: c.textDim,
    },
    followSmLabelOn: {
      color: c.onAccent,
    },

    hero: {
      flex: 1,
      justifyContent: 'center',
    },
    footer: {
      alignItems: 'center',
      gap: Spacing.three,
    },
    caption: {
      fontFamily: BrandFonts.sans,
      fontSize: 14,
      lineHeight: 21,
      color: c.textDim,
      textAlign: 'center',
    },
    likes: {
      fontFamily: BrandFonts.sans,
      fontSize: 12,
      color: c.textFaint,
      letterSpacing: 0.4,
    },
    swipeHint: {
      fontFamily: BrandFonts.sans,
      fontSize: 11,
      letterSpacing: 0.6,
      color: c.textFaint,
      marginTop: Spacing.one,
    },

    emptyWrap: {
      paddingHorizontal: Spacing.four,
      paddingBottom: Spacing.six,
      alignItems: 'center',
    },
    emptyTitle: {
      fontFamily: BrandFonts.hand,
      fontSize: 30,
      color: c.text,
      textAlign: 'center',
    },
    emptyText: {
      fontFamily: BrandFonts.sans,
      fontSize: 14,
      lineHeight: 21,
      color: c.textDim,
      textAlign: 'center',
      marginTop: Spacing.two,
      marginBottom: Spacing.four,
    },
    emptyList: {
      alignSelf: 'stretch',
      gap: Spacing.three,
    },
    emptyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      padding: Spacing.three,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.line,
      backgroundColor: c.raised,
    },
    emptyRowText: {
      flex: 1,
    },
  });
