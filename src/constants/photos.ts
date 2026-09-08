/**
 * Real photos for Explore — curated once (via `scripts/fetch-unsplash.ts` +
 * manual Wikimedia Commons search), not fetched live. Two sources:
 *
 * - Unsplash, for category covers and generic "beautiful background" posts
 *   (`download_location` was pinged for each at curation time per Unsplash's
 *   API Guidelines — see `scripts/trigger-unsplash-download.ts`).
 * - Wikimedia Commons, for real portraits of quote authors ("quote over
 *   their actual face") — restricted to verified public-domain images only
 *   (checked via Commons' `imageinfo` API; a CC BY 2.0 Mandela portrait was
 *   dropped for this reason — public domain only, no attribution to carry),
 *   never scraped search-engine images, which carry no redistribution rights.
 *
 * All 8 topics have a cover photo now. Only Anime/Politics/Workout have
 * full photo *post* content (`QUOTE_PHOTOS` below) — Family/Music/Romance/
 * Travel/For You are cover-only for now, per the plan.
 */
import type { TopicId } from '@/constants/topics';

export type StockPhoto = {
  url: string;
  photographer: string;
  photographerUrl: string;
  /** Shown as attribution in the post detail overlay. */
  license: string;
};

const unsplash = (
  url: string,
  photographer: string,
  photographerUrl: string,
): StockPhoto => ({ url, photographer, photographerUrl, license: 'Unsplash' });

const wikimedia = (
  url: string,
  photographer: string,
  photographerUrl: string,
  license: string,
): StockPhoto => ({ url, photographer, photographerUrl, license });

/**
 * The category tile's cover photo (`TopicGrid`). All 8 topics have one now
 * — Anime/Politics/Workout also have full post content (`QUOTE_PHOTOS`
 * below); Family/Music/Romance/Travel/For You are cover-only for now, so
 * their category view still falls back to whatever quotes are tagged (or
 * the empty state).
 */
export const CATEGORY_COVERS: Partial<Record<TopicId, StockPhoto>> = {
  'for-you': unsplash(
    'https://images.unsplash.com/photo-1685478237603-a167521106c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'melanfolia меланфолія',
    'https://unsplash.com/@melanfolia?utm_source=quotable&utm_medium=referral',
  ),
  anime: unsplash(
    'https://images.unsplash.com/photo-1674448417295-088682b6adec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'Vishwanth Pindiboina',
    'https://unsplash.com/@vishwanth07?utm_source=quotable&utm_medium=referral',
  ),
  politics: unsplash(
    'https://images.unsplash.com/photo-1767189064026-750207a7b20e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'Nick Brink',
    'https://unsplash.com/@onthebrink47?utm_source=quotable&utm_medium=referral',
  ),
  workout: unsplash(
    'https://images.unsplash.com/photo-1722925541142-5db2668ca492?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'Tyler Raye',
    'https://unsplash.com/@tcraye?utm_source=quotable&utm_medium=referral',
  ),
  family: unsplash(
    'https://images.unsplash.com/photo-1742522450616-a2cf0cba1274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'Jennifer Kalenberg',
    'https://unsplash.com/@jkalen71?utm_source=quotable&utm_medium=referral',
  ),
  music: unsplash(
    'https://images.unsplash.com/photo-1636788358412-4e5342dad7ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'Jonas Leupe',
    'https://unsplash.com/@jonasleupe?utm_source=quotable&utm_medium=referral',
  ),
  romance: unsplash(
    'https://images.unsplash.com/photo-1575388104683-e076ee9ccaa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'Dominic Sansotta',
    'https://unsplash.com/@dsan_nowsay?utm_source=quotable&utm_medium=referral',
  ),
  travel: unsplash(
    'https://images.unsplash.com/photo-1529736576495-1ed4a29ca7e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'Yoal Desurmont',
    'https://unsplash.com/@yoal_desurmont?utm_source=quotable&utm_medium=referral',
  ),
};

/**
 * A real photo for a specific quote, keyed by `LibraryQuote.id` — rendered
 * as the quote's background (via `wallpaperForQuote` in `lib/explore-feed`)
 * instead of a grayscale preset. Mixes real portraits of the actual author
 * (Wikimedia) with generic mood photography (Unsplash), by design — see the
 * dev-log for which quotes got which and why.
 */
export const QUOTE_PHOTOS: Record<string, StockPhoto> = {
  // anime
  'lib-20': unsplash(
    'https://images.unsplash.com/photo-1714537097791-be0ba0473b9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'Chau Nguyen',
    'https://unsplash.com/@chaunguyengrafix?utm_source=quotable&utm_medium=referral',
  ),
  'lib-21': unsplash(
    'https://images.unsplash.com/photo-1714537076751-f3955b5578a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'Chau Nguyen',
    'https://unsplash.com/@chaunguyengrafix?utm_source=quotable&utm_medium=referral',
  ),
  'lib-24': unsplash(
    'https://images.unsplash.com/photo-1734480670025-01d8b68b9d41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'One91creative',
    'https://unsplash.com/@one91creative?utm_source=quotable&utm_medium=referral',
  ),

  // workout
  'lib-7': unsplash(
    'https://images.unsplash.com/photo-1549476464-37392f717541?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'John Fornander',
    'https://unsplash.com/@johnfo?utm_source=quotable&utm_medium=referral',
  ),
  'lib-10': unsplash(
    'https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'Eduardo Cano Photo Co.',
    'https://unsplash.com/@eduardocanophotoco?utm_source=quotable&utm_medium=referral',
  ),
  'lib-12': unsplash(
    'https://images.unsplash.com/photo-1592588253414-887759037c2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'LOGAN WEAVER | @LGNWVR',
    'https://unsplash.com/@lgnwvr?utm_source=quotable&utm_medium=referral',
  ),

  // politics — real portraits of the actual quote authors (public domain /
  // CC-licensed, verified via Wikimedia Commons' imageinfo API)
  'lib-61': wikimedia(
    'https://upload.wikimedia.org/wikipedia/commons/4/44/Abraham_Lincoln_head_on_shoulders_photo_portrait.jpg',
    'Alexander Gardner',
    'https://commons.wikimedia.org/wiki/File:Abraham_Lincoln_head_on_shoulders_photo_portrait.jpg',
    'Public domain',
  ),
  'lib-62': wikimedia(
    'https://upload.wikimedia.org/wikipedia/commons/4/44/Abraham_Lincoln_head_on_shoulders_photo_portrait.jpg',
    'Alexander Gardner',
    'https://commons.wikimedia.org/wiki/File:Abraham_Lincoln_head_on_shoulders_photo_portrait.jpg',
    'Public domain',
  ),
  'lib-65': wikimedia(
    'https://upload.wikimedia.org/wikipedia/commons/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg',
    'Elliott & Fry',
    'https://commons.wikimedia.org/wiki/File:Mahatma-Gandhi,_studio,_1931.jpg',
    'Public domain',
  ),
  'lib-63': unsplash(
    'https://images.unsplash.com/photo-1534293230397-c067fc201ab8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'Parker Johnson',
    'https://unsplash.com/@pkripperprivate?utm_source=quotable&utm_medium=referral',
  ),
  'lib-66': unsplash(
    'https://images.unsplash.com/photo-1596514139339-c913602509fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'Phillip Goldsberry',
    'https://unsplash.com/@phillipgold?utm_source=quotable&utm_medium=referral',
  ),
};
