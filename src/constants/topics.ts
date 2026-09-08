/**
 * Explore's topic taxonomy — the "Browse by category" tile grid at the top
 * of Explore, and the filter applied to the masonry feed below it.
 *
 * Deliberately separate from `MoodId` (see `constants/library.ts`): moods
 * keep driving Studio presets, onboarding's Interests step, and
 * quote-generation `Tone` untouched. Topics are a curated, Explore-only tag
 * layered on top — `QUOTE_TOPICS` is hand-authored (like `STORIES` is keyed
 * by author) rather than inferred from mood/keywords, so tagging quality
 * stays intentional.
 *
 * v2 (replaces the earlier For You/Funny/Life/Love/Friendship/Work/Movies/
 * Music/Random set): Family/Anime/Music/Romance/Travel/Politics/Workout,
 * plus For You. Only Anime/Politics/Workout have real photos + full content
 * right now (see `constants/photos.ts`) — Family/Travel are real, clickable
 * categories with no content yet (they show the standard empty state);
 * Music/Romance are populated by reusing quotes tagged for them already,
 * just without a curated photo set.
 */
import type { LibraryQuote } from '@/constants/library';

export type TopicId =
  | 'for-you'
  | 'anime'
  | 'politics'
  | 'workout'
  | 'family'
  | 'music'
  | 'romance'
  | 'travel';

export type Topic = { id: TopicId; label: string; blurb: string };

export const TOPICS: readonly Topic[] = [
  { id: 'for-you', label: 'For You', blurb: 'picked with you in mind' },
  { id: 'anime', label: 'Anime', blurb: 'lines that never give up' },
  { id: 'politics', label: 'Politics', blurb: 'words on power, voice, and change' },
  { id: 'workout', label: 'Workout', blurb: 'fuel for the last rep' },
  { id: 'family', label: 'Family', blurb: 'the people who shaped you' },
  { id: 'music', label: 'Music', blurb: 'words set to a rhythm' },
  { id: 'romance', label: 'Romance', blurb: 'the tender ones' },
  { id: 'travel', label: 'Travel', blurb: 'words for the road' },
];

/**
 * Curated topic tags, keyed by `LibraryQuote.id`. `for-you` isn't listed
 * here — it means "no topic filter," not a tag any quote carries. A quote
 * with no entry (or an empty list) still shows up under `for-you`, just not
 * under any specific topic pill.
 */
export const QUOTE_TOPICS: Record<string, TopicId[]> = {
  // anime — the existing anime-mood library
  'lib-19': ['anime'],
  'lib-20': ['anime'],
  'lib-21': ['anime'],
  'lib-22': ['anime'],
  'lib-23': ['anime'],
  'lib-24': ['anime'],

  // politics — new content, see library.ts, plus Mandela (already in the
  // library as a motivation quote)
  'lib-4': ['politics'],
  'lib-61': ['politics'],
  'lib-62': ['politics'],
  'lib-63': ['politics'],
  'lib-64': ['politics'],
  'lib-65': ['politics'],
  'lib-66': ['politics'],

  // workout — the existing workout-mood library
  'lib-7': ['workout'],
  'lib-8': ['workout'],
  'lib-9': ['workout'],
  'lib-10': ['workout'],
  'lib-11': ['workout'],
  'lib-12': ['workout'],

  // music — content already written for the old topic set, reused as-is
  'lib-55': ['music'],
  'lib-56': ['music'],
  'lib-57': ['music'],

  // romance — the existing romance-mood library
  'lib-13': ['romance'],
  'lib-14': ['romance'],
  'lib-15': ['romance'],
  'lib-16': ['romance'],
  'lib-17': ['romance'],
  'lib-18': ['romance'],

  // family, travel — no content yet (deliberately: clickable now, built
  // out later, per the plan)
};

export function topicsForQuote(quote: LibraryQuote): TopicId[] {
  return QUOTE_TOPICS[quote.id] ?? [];
}
