/**
 * Quotable domain constants + shared types.
 *
 * Core function: hand someone the words they need to hear right now — tuned to
 * what's weighing on them, the voice they respond to, and the time of day.
 * Onboarding gathers these through a quiet conversation, not a quiz.
 */

/** Something weighing on the user. Onboarding lets them pick any, one, or none. */
export type PainPoint =
  | 'anxiety'
  | 'stress'
  | 'overthinking'
  | 'self-doubt'
  | 'burnout'
  | 'loneliness'
  | 'grief'
  | 'feeling stuck';

export const PAIN_POINTS: readonly PainPoint[] = [
  'anxiety',
  'stress',
  'overthinking',
  'self-doubt',
  'burnout',
  'loneliness',
  'grief',
  'feeling stuck',
];

/**
 * The voice the user responds to — inferred indirectly from a scenario
 * question rather than asked outright.
 */
export type Tone = 'gentle' | 'direct' | 'reflective' | 'warm';

/** How each tone should shape the quote's voice (used in the prompt). */
export const TONE_VOICE: Record<Tone, string> = {
  gentle: 'soft, tender, reassuring — like a hand on the shoulder',
  direct: 'plainspoken and bracing — a straight-talking friend who believes in them',
  reflective: 'quiet and thoughtful — an invitation to sit with the feeling',
  warm: 'warm and a little wry — kind, human, lightly hopeful',
};

/** The single scenario question that reveals which voice they want. */
export const VOICE_SCENARIO = {
  prompt: 'a friend catches you at a low moment.\nthe reply that would land best is…',
  options: [
    { label: '“i’m here. just breathe.”', tone: 'gentle' as Tone },
    { label: '“get up — you’ve got this.”', tone: 'direct' as Tone },
    { label: '“let’s sit with it a second.”', tone: 'reflective' as Tone },
    { label: '“ok, first — have you eaten?”', tone: 'warm' as Tone },
  ],
};

/**
 * Onboarding v3 (see src/components/onboarding/) replaced the old
 * goal/entryReason/priorExperience/lifeFocus/vibe/thinkers question set with
 * a single mood-picking screen — those types are gone; `MOOD_TO_TONE` in
 * `constants/library.ts` now derives `Tone` from the moods the user picks
 * there instead of a dedicated vibe question.
 */

/** A saved local account, created during onboarding. See lib/storage.ts. */
export type Account = {
  name: string;
  email: string;
  /** NOT real security — a mock local-only "hash" for demo auth with no backend. */
  passwordHash: string;
};

/** The time of day the daily-quote notification fires, chosen via the onboarding wheel picker. */
export type NotifyTime = { hour: number; minute: number };

export const DEFAULT_NOTIFY_TIME: NotifyTime = { hour: 9, minute: 0 };

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

/** Bucket the current wall-clock hour into a time of day. */
export function timeOfDay(date: Date = new Date()): TimeOfDay {
  const h = date.getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

/** A soft, lowercase greeting for the Today screen. */
export function greeting(tod: TimeOfDay = timeOfDay()): string {
  switch (tod) {
    case 'morning':
      return 'good morning';
    case 'afternoon':
      return 'good afternoon';
    case 'evening':
      return 'good evening';
  }
}

/** A quote the app surfaces — generated live, or kept in favorites. */
export type Quote = {
  id: string;
  text: string;
  /** Attributed author, or null when the line is original / anonymous. */
  author: string | null;
  /** One short reflection tying the quote to the moment. */
  reflection: string;
  /** Epoch ms when this quote was surfaced (used for ordering favorites). */
  createdAt: number;
  /** True when the author has a "story behind the person" entry (see Feed). */
  hasStory?: boolean;
};

/**
 * A wallpaper the user composed in Studio. Stored as a recipe (quote + preset +
 * optional photo + type settings) so it re-renders anywhere without managing
 * image files.
 */
export type Wallpaper = {
  id: string;
  text: string;
  author: string | null;
  /** Background preset id (see WALLPAPER_PRESETS). Ignored when photoUri is set. */
  presetId: string;
  /** A picked photo used as the background instead of the preset. */
  photoUri?: string | null;
  /** Text colour: light copy on dark grounds, dark copy on light. */
  ink: 'light' | 'dark';
  align: 'center' | 'left';
  /** Quote type size multiplier (0.8 – 1.4). */
  fontScale: number;
  createdAt: number;
};

/** The user's own profile. Their bio *is* their favourite quote. */
export type Profile = {
  username: string;
  avatarUri: string | null;
  /** The quote shown as the bio — the user's single favourite line. */
  bioQuote: Quote | null;
};

/**
 * A user-created collection of quotes (Explore's "save to library" picker,
 * Spotify-playlist-style) — separate from `favorites` above, which stays a
 * single flat list untouched by this. A quote can sit in any number of
 * libraries at once.
 */
export type Library = {
  id: string;
  name: string;
  quotes: Quote[];
};
