/**
 * Builds Explore's masonry feed from the seeded content: `FEED` posts render
 * as "social" cards (their real `FEED`-assigned creator); every other
 * `LIBRARY` quote renders as an "image pin" card (a `WallpaperCanvas`
 * thumbnail) with a hash-picked fictional creator (`creatorForPin`) — every
 * post has a real account underneath it, never bare photo-credit text.
 * Filtering (topic / search / following) all happens here, client-side —
 * there's no backend.
 */
import {
  CREATORS,
  FEED,
  LIBRARY,
  WALLPAPER_PRESETS,
  creatorById,
  presetById,
  type LibraryQuote,
  type Creator,
} from '@/constants/library';
import { QUOTE_PHOTOS } from '@/constants/photos';
import type { Wallpaper } from '@/constants/quotable';
import { topicsForQuote, type TopicId } from '@/constants/topics';

export type SocialPost = {
  kind: 'social';
  id: string;
  quote: LibraryQuote;
  creator: Creator;
  caption?: string;
  likes: number;
  comments: number;
  hoursAgo: number;
};

export type PinPost = {
  kind: 'pin';
  id: string;
  quote: LibraryQuote;
  /** Every post shows a user account underneath it — a pin's real "poster"
   * is one of the seeded fictional creators (see `creatorForPin` below),
   * not the photographer, so Explore never surfaces photo-credit text. */
  creator: Creator;
  presetId: string;
  /** Cosmetic aspect-ratio variety for the masonry — width / height. */
  aspect: number;
  likes: number;
  comments: number;
};

export type ExplorePost = SocialPost | PinPost;

/** A small deterministic hash — same input always gives the same output, so
 * seeded stats/shapes/order don't jump around on re-render, but nothing
 * cycles in an obviously mechanical pattern either. */
function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function seededStat(id: string, base: number, spread: number): number {
  return base + (hash(id) % spread);
}

/** mulberry32 — a tiny seeded PRNG, so the shuffle below is stable across
 * renders/reloads without needing to store an order anywhere. */
function seededRandom(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic Fisher-Yates. Sorting by `hash(id)` looks like a shuffle
 * but isn't one: ids that share a shape (the short "f1".."f8" social-post
 * ids vs. the much longer "pin-lib-N" ones) hash into very different
 * numeric ranges, so a sort clumps them right back into blocks instead of
 * interleaving them. */
function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const arr = [...items];
  const rand = seededRandom(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// A wider, less-regular spread of shapes than a 2-3 value cycle — Pinterest's
// masonry reads as organic because neighboring pins rarely share a shape.
const ASPECTS = [0.62, 0.72, 0.8, 0.88, 0.95, 1.05, 1.15, 1.3];

/** Same quote always gets the same ground/shape, whether it's rendered as a
 * pin in the mixed feed or a `CategoryTile` in a category view. */
export function presetForQuote(quoteId: string): string {
  return WALLPAPER_PRESETS[hash(quoteId) % WALLPAPER_PRESETS.length].id;
}

export function aspectForQuote(quoteId: string): number {
  return ASPECTS[hash(quoteId + 'a') % ASPECTS.length];
}

/** Every pin gets a real user account, not photo-credit text — a seeded
 * fictional creator, hash-picked so it's stable per quote. Explore's photos
 * are public-domain only (see constants/photos.ts), so there's no
 * attribution to carry — nothing to special-case here. */
export function creatorForPin(quote: LibraryQuote): Creator {
  return CREATORS[hash(quote.id + 'creator') % CREATORS.length];
}

/** Builds an ephemeral `Wallpaper` recipe so any quote — pin-sourced or
 * social-sourced — can render as a clean image/quote tile (`CategoryTile`),
 * reusing Studio's existing render pipeline. Not persisted; just a display
 * recipe. When the quote has a curated real photo (`QUOTE_PHOTOS`), that
 * becomes the background instead of a grayscale preset — `WallpaperCanvas`
 * already knows how to scrim + letter over a `photoUri` (Studio's
 * custom-photo wallpapers use the same path). */
export function wallpaperForQuote(quote: LibraryQuote): Wallpaper {
  const photo = QUOTE_PHOTOS[quote.id];
  const presetId = presetForQuote(quote.id);
  return {
    id: `wp-${quote.id}`,
    text: quote.text,
    author: quote.author,
    presetId,
    photoUri: photo?.url ?? null,
    // Use the preset's own recommended ink, not a hardcoded one — a light
    // preset (paper/fog/ruled) needs dark text, a dark one (ink/graphite/
    // dotgrid) needs light text, or the quote renders invisible. A real
    // photo always gets light text — WallpaperCanvas scrims photoUri
    // backgrounds specifically to make that legible.
    ink: photo ? 'light' : presetById(presetId).ink,
    align: 'center',
    fontScale: 0.9,
    createdAt: quote.createdAt,
  };
}

export function buildExplorePosts(): ExplorePost[] {
  const usedQuoteIds = new Set(FEED.map((p) => p.quoteId));

  const social: SocialPost[] = FEED.map((post): SocialPost | null => {
    const creator = creatorById(post.creatorId);
    const quote = LIBRARY.find((q) => q.id === post.quoteId);
    if (!creator || !quote) return null;
    return {
      kind: 'social',
      id: post.id,
      quote,
      creator,
      caption: post.caption,
      likes: post.likes,
      comments: seededStat(post.id, 8, 240),
      hoursAgo: post.hoursAgo,
    };
  }).filter((p): p is SocialPost => p !== null);

  const pins: PinPost[] = LIBRARY.filter((q) => !usedQuoteIds.has(q.id)).map((quote) => ({
    kind: 'pin' as const,
    id: `pin-${quote.id}`,
    quote,
    creator: creatorForPin(quote),
    // Hash-picked, not cycled by array index — a strict i % n cycle repeats
    // the same handful of shapes/grounds in the same order every few cards,
    // which reads as mechanical rather than an organic Pinterest-style mix.
    presetId: presetForQuote(quote.id),
    aspect: aspectForQuote(quote.id),
    likes: seededStat(quote.id, 40, 900),
    comments: seededStat(quote.id + 'c', 2, 60),
  }));

  // Interleave posts + pins (a stable shuffle, not sorted by id) instead of
  // running all social posts first and all pins after — a real feed should
  // read as one mixed combination of text posts and image pins throughout,
  // not two separate blocks, and it keeps topic-clustered library quotes
  // (all the romance ones back to back, etc.) from scrolling by as a long
  // visually-uniform run.
  return seededShuffle([...social, ...pins], 20260907);
}

type Filters = {
  topic: TopicId;
  query: string;
  followingOnly: boolean;
  isFollowing: (creatorId: string) => boolean;
};

export function filterExplorePosts(posts: ExplorePost[], f: Filters): ExplorePost[] {
  const q = f.query.trim().toLowerCase();

  return posts.filter((post) => {
    if (f.followingOnly && !f.isFollowing(post.creator.id)) return false;
    if (f.topic !== 'for-you' && !topicsForQuote(post.quote).includes(f.topic)) {
      return false;
    }
    if (q) {
      const haystack = [post.quote.text, post.quote.author ?? '', post.creator.name, post.creator.handle]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
