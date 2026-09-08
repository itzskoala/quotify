/**
 * The seeded content that powers Explore (mood board), Feed (creators + stories)
 * and Studio (wallpaper backgrounds). All local — no backend for the MVP.
 *
 * `LibraryQuote`s carry a stable `id` so Feed posts and author Stories can
 * reference them. Some quotes have `hasStory: true`; those authors get a full
 * entry in `STORIES`, unlocking the "tap a quote → read the person's story"
 * moment on the Feed.
 */
import type { Quote, Tone } from '@/constants/quotable';

/** The mood-board categories. */
export type MoodId =
  | 'motivation'
  | 'workout'
  | 'romance'
  | 'anime'
  | 'movies'
  | 'calm'
  | 'wisdom';

export type Mood = {
  id: MoodId;
  label: string;
  blurb: string;
  /** A single emoji glyph used as the board tile mark. */
  glyph: string;
};

export const MOODS: readonly Mood[] = [
  { id: 'motivation', label: 'Motivation', blurb: 'fuel for the hard days', glyph: '⚡' },
  { id: 'workout', label: 'Workout', blurb: 'one more rep', glyph: '🏋️' },
  { id: 'romance', label: 'Romance', blurb: 'the tender ones', glyph: '❤️' },
  { id: 'anime', label: 'Anime', blurb: 'never give up', glyph: '🌀' },
  { id: 'movies', label: 'Movies', blurb: 'lines that stayed', glyph: '🎬' },
  { id: 'calm', label: 'Calm', blurb: 'breathe, slow down', glyph: '🌙' },
  { id: 'wisdom', label: 'Wisdom', blurb: 'the old truths', glyph: '🕯️' },
];

/**
 * Onboarding v3 asks which moods someone wants (see
 * src/components/onboarding/categories.tsx) instead of a separate abstract
 * "vibe" question. This derives the live quote generator's `Tone`
 * (src/lib/anthropic.ts) from the first mood picked, so one screen now does
 * the work the old vibe question + goal/entryReason/etc. used to.
 */
export const MOOD_TO_TONE: Record<MoodId, Tone> = {
  motivation: 'direct',
  workout: 'direct',
  romance: 'warm',
  anime: 'warm',
  movies: 'reflective',
  calm: 'gentle',
  wisdom: 'reflective',
};

/** A seeded quote in the library, tagged with its mood. */
export type LibraryQuote = Quote & { mood: MoodId };

let seq = 0;
function q(
  mood: MoodId,
  text: string,
  author: string | null,
  reflection = '',
  hasStory = false,
): LibraryQuote {
  seq += 1;
  return {
    id: `lib-${seq}`,
    text,
    author,
    reflection,
    hasStory,
    mood,
    createdAt: Date.now() - seq * 1000,
  };
}

export const LIBRARY: readonly LibraryQuote[] = [
  // — motivation —
  q('motivation', 'The best way out is always through.', 'Robert Frost', 'you can’t go around it. so go.'),
  q('motivation', 'Whether you think you can, or you think you can’t — you’re right.', 'Henry Ford'),
  q('motivation', 'Fall seven times, stand up eight.', null, 'a Japanese proverb'),
  q('motivation', 'It always seems impossible until it’s done.', 'Nelson Mandela', '', true),
  q('motivation', 'Do the thing you fear, and the death of fear is certain.', 'Ralph Waldo Emerson'),
  q('motivation', 'A year from now you may wish you had started today.', 'Karen Lamb'),

  // — workout —
  q('workout', 'The body achieves what the mind believes.', null),
  q('workout', 'Pain is weakness leaving the body.', null, 'tape it to the mirror'),
  q('workout', 'Don’t count the days, make the days count.', 'Muhammad Ali', '', true),
  q('workout', 'The last three or four reps is what makes the muscle grow.', 'Arnold Schwarzenegger'),
  q('workout', 'Absorb what is useful, discard what is not, add what is uniquely your own.', 'Bruce Lee', '', true),
  q('workout', 'Discipline is choosing between what you want now and what you want most.', null),

  // — romance —
  q('romance', 'Whatever our souls are made of, his and mine are the same.', 'Emily Brontë'),
  q('romance', 'You are, and always have been, my dream.', 'Nicholas Sparks'),
  q('romance', 'I have found the one whom my soul loves.', null, 'Song of Solomon'),
  q('romance', 'If I know what love is, it is because of you.', 'Hermann Hesse'),
  q('romance', 'To love and be loved is to feel the sun from both sides.', 'David Viscott'),
  q('romance', 'I would rather share one lifetime with you than face all the ages of this world alone.', 'J.R.R. Tolkien'),

  // — anime —
  q('anime', 'A lesson without pain is meaningless.', 'Edward Elric', 'Fullmetal Alchemist'),
  q('anime', 'If you don’t take risks, you can’t create a future.', 'Monkey D. Luffy', 'One Piece'),
  q('anime', 'It’s not about being perfect. It’s about giving everything you’ve got.', null, 'Haikyuu!!'),
  q('anime', 'The moment you think of giving up, think of the reason why you held on so long.', 'Natsu Dragneel', 'Fairy Tail'),
  q('anime', 'Hard work betrays none, but dreams betray many.', null, 'Hachiman, Oregairu'),
  q('anime', 'Power comes in response to a need, not a desire.', 'Goku', 'Dragon Ball'),

  // — movies —
  q('movies', 'Why do we fall? So we can learn to pick ourselves up.', null, 'Batman Begins'),
  q('movies', 'Do, or do not. There is no try.', 'Yoda', 'The Empire Strikes Back'),
  q('movies', 'Get busy living, or get busy dying.', null, 'The Shawshank Redemption'),
  q('movies', 'It’s not who I am underneath, but what I do that defines me.', null, 'Batman Begins'),
  q('movies', 'Life is like a box of chocolates. You never know what you’re gonna get.', null, 'Forrest Gump'),
  q('movies', 'To infinity and beyond.', 'Buzz Lightyear', 'Toy Story'),

  // — calm —
  q('calm', 'Almost everything will work again if you unplug it for a few minutes — including you.', 'Anne Lamott'),
  q('calm', 'You are the sky. Everything else is just the weather.', 'Pema Chödrön'),
  q('calm', 'Nature does not hurry, yet everything is accomplished.', 'Lao Tzu'),
  q('calm', 'Within you there is a stillness and a sanctuary you can retreat to at any time.', 'Hermann Hesse'),
  q('calm', 'The quieter you become, the more you are able to hear.', 'Rumi', '', true),
  q('calm', 'Breathe. You’re allowed to be both a masterpiece and a work in progress.', null),

  // — wisdom —
  q('wisdom', 'You have power over your mind — not outside events. Realize this, and you will find strength.', 'Marcus Aurelius', '', true),
  q('wisdom', 'We can complain because rose bushes have thorns, or rejoice because thorns have roses.', 'Abraham Lincoln', '', true),
  q('wisdom', 'I’ve learned that people will forget what you said, but never how you made them feel.', 'Maya Angelou', '', true),
  q('wisdom', 'The only true wisdom is in knowing you know nothing.', 'Socrates'),
  q('wisdom', 'What you seek is seeking you.', 'Rumi', '', true),
  q('wisdom', 'Normality is a paved road: it’s comfortable to walk, but no flowers grow.', 'Vincent van Gogh', '', true),

  // — new for Explore's topic pills (funny/life/friendship/work/music/random
  // have no natural home in the 7 moods above) — kept on the closest-toned
  // existing mood for Studio/tone purposes; see constants/topics.ts for the
  // actual topic tagging —
  q('movies', 'I told my computer I needed a break, and now it won’t stop sending me vacation ads.', null),
  q('movies', 'My bed is a magical place where I suddenly remember everything I forgot to do.', null),
  q('movies', 'I’m not lazy. I’m on energy-saving mode.', null),

  q('wisdom', 'Some days are for building. Some days are just for getting through. Both count.', null),
  q('wisdom', 'You don’t find your life by planning it — you find it by living the parts you didn’t.', null),
  q('wisdom', 'Nobody has it figured out. Some people are just better at looking like they do.', null),

  q('romance', 'A good friend remembers the version of you that you forgot you were.', null),
  q('romance', 'Distance doesn’t end a friendship. Silence does.', null),
  q('romance', 'The best people are the ones you can sit in silence with and still feel understood.', null),

  q('motivation', 'Do the boring part well and the interesting part gets to happen.', null),
  q('motivation', 'Your job is not your worth. Do it well anyway.', null),
  q('motivation', 'A little progress each day adds up to big results.', null),

  q('calm', 'Some feelings only make sense set to a melody.', null),
  q('calm', 'A good song is a memory you can replay on command.', null),
  q('calm', 'Turn it up. Let it hold what words can’t.', null),

  q('wisdom', 'Not everything needs a reason. Some things just need room to happen.', null),
  q('calm', 'Chaos is just order we haven’t recognized yet.', null),
  q('motivation', 'Pick a weird hobby. It’ll save you one day.', null),

  // — new for Explore's Politics category — strictly civic/non-partisan:
  // voting, government, public service. No current politicians, parties, or
  // hot-button issues; real quotes are historical and broadly non-partisan.
  q('wisdom', 'The ballot is stronger than the bullet.', 'Abraham Lincoln'),
  q('wisdom', 'Government of the people, by the people, for the people, shall not perish from the earth.', 'Abraham Lincoln'),
  q('wisdom', 'The vote is the most powerful instrument ever devised by man for breaking down injustice.', 'Lyndon B. Johnson'),
  q('wisdom', 'Voting is the expression of our commitment to ourselves, one another, this country, and this world.', 'Sharon Salzberg'),
  q('motivation', 'A nation’s greatness is measured by how it treats its weakest members.', 'Mahatma Gandhi'),
  q('motivation', 'Show up. Speak up. That’s how democracies stay alive.', null),
];

export function quotesForMood(mood: MoodId): LibraryQuote[] {
  return LIBRARY.filter((x) => x.mood === mood);
}

export function libraryQuoteById(id: string): LibraryQuote | undefined {
  return LIBRARY.find((x) => x.id === id);
}

/* ------------------------------------------------------------------ */
/* Creators — the people you follow on the Feed                        */
/* ------------------------------------------------------------------ */

export type Creator = {
  id: string;
  handle: string;
  name: string;
  bio: string;
  moods: MoodId[];
};

export const CREATORS: readonly Creator[] = [
  {
    id: 'stoic-daily',
    handle: '@stoicdaily',
    name: 'The Stoic Daily',
    bio: 'One old truth a day. Mostly Marcus, Seneca, and a little Socrates.',
    moods: ['wisdom', 'calm'],
  },
  {
    id: 'iron-mind',
    handle: '@ironmind',
    name: 'Iron Mind',
    bio: 'Quotes for the last three reps and the early mornings.',
    moods: ['workout', 'motivation'],
  },
  {
    id: 'sub-scenes',
    handle: '@subscenes',
    name: 'Subtitle Scenes',
    bio: 'The anime + movie lines that lived in your head rent-free.',
    moods: ['anime', 'movies'],
  },
  {
    id: 'soft-hours',
    handle: '@softhours',
    name: 'Soft Hours',
    bio: 'Tender lines for slow evenings and people you love.',
    moods: ['romance', 'calm'],
  },
];

export function creatorById(id: string): Creator | undefined {
  return CREATORS.find((x) => x.id === id);
}

/* ------------------------------------------------------------------ */
/* Feed — posts from creators, ordered newest-first                    */
/* ------------------------------------------------------------------ */

export type FeedPost = {
  id: string;
  creatorId: string;
  quoteId: string;
  caption?: string;
  likes: number;
  hoursAgo: number;
};

export const FEED: readonly FeedPost[] = [
  { id: 'f1', creatorId: 'stoic-daily', quoteId: 'lib-37', caption: 'Read this twice before you open your inbox.', likes: 1284, hoursAgo: 2 },
  { id: 'f2', creatorId: 'iron-mind', quoteId: 'lib-9', caption: 'Ali again. Never misses.', likes: 903, hoursAgo: 4 },
  { id: 'f3', creatorId: 'sub-scenes', quoteId: 'lib-19', caption: 'Edward Elric taught a generation about equivalent exchange.', likes: 2210, hoursAgo: 6 },
  { id: 'f4', creatorId: 'soft-hours', quoteId: 'lib-13', caption: 'Brontë knew.', likes: 640, hoursAgo: 9 },
  { id: 'f5', creatorId: 'stoic-daily', quoteId: 'lib-38', caption: 'Lincoln, on choosing what to see.', likes: 1502, hoursAgo: 14 },
  { id: 'f6', creatorId: 'iron-mind', quoteId: 'lib-11', caption: 'Bruce Lee — the whole philosophy in one line.', likes: 1988, hoursAgo: 20 },
  { id: 'f7', creatorId: 'soft-hours', quoteId: 'lib-35', caption: 'Rumi for the quiet part of the night.', likes: 774, hoursAgo: 26 },
  { id: 'f8', creatorId: 'sub-scenes', quoteId: 'lib-25', caption: 'Every gym montage owes this one.', likes: 1120, hoursAgo: 31 },
];

/* ------------------------------------------------------------------ */
/* Stories — the person behind the quote                               */
/* ------------------------------------------------------------------ */

export type Story = {
  author: string;
  era: string;
  title: string;
  paragraphs: string[];
};

/** Keyed by exact author name (as it appears on the quote). */
export const STORIES: Record<string, Story> = {
  'Abraham Lincoln': {
    author: 'Abraham Lincoln',
    era: '1809 – 1865',
    title: 'The self-taught president',
    paragraphs: [
      'Born in a one-room log cabin on the Kentucky frontier, Lincoln had less than a year of formal schooling in his whole life. He taught himself to read by firelight, borrowing books from neighbors and walking miles to return them.',
      'He failed in business, lost more elections than he won, and carried a lifelong heaviness he called his "melancholy." Friends worried for him in his darkest stretches. He kept going anyway — practicing law, telling stories, believing the country could be better than it was.',
      'As the 16th president he held a fracturing nation together through its bloodiest war and signed the Emancipation Proclamation. He was assassinated days after the war ended. The man who joked that thorns have roses had spent his life choosing to see the roses.',
    ],
  },
  'Maya Angelou': {
    author: 'Maya Angelou',
    era: '1928 – 2014',
    title: 'The caged bird who sang',
    paragraphs: [
      'After a childhood trauma, Angelou went silent for nearly five years — convinced her words could hurt people. A teacher coaxed her back to language through poetry, and she never stopped again.',
      'Before she was a celebrated author she was a cook, a streetcar conductor, a dancer, and a singer. She spoke six languages and worked alongside Malcolm X and Martin Luther King Jr. in the civil rights movement.',
      'Her memoir "I Know Why the Caged Bird Sings" made her one of the most beloved writers in America. Her most quoted line is the one she lived by: people forget what you say, but never how you made them feel.',
    ],
  },
  'Marcus Aurelius': {
    author: 'Marcus Aurelius',
    era: '121 – 180 AD',
    title: 'The emperor who wrote to himself',
    paragraphs: [
      'Marcus ruled Rome at the height of its power, yet his private notebook — never meant for anyone else — is a running argument with his own ego, fear, and anger.',
      'He wrote much of it in an army tent on the empire’s frontier, between plague and endless war. The theme repeats: you don’t control what happens, only how you meet it.',
      'Those notes survived by accident and became "Meditations" — read two thousand years later by people who’ve never worn a crown, because the struggle to master your own mind never went out of style.',
    ],
  },
  'Rumi': {
    author: 'Rumi',
    era: '1207 – 1273',
    title: 'The scholar who became a poet',
    paragraphs: [
      'Rumi was a respected but ordinary religious teacher until, in his late thirties, he met a wandering mystic named Shams. The friendship cracked him wide open.',
      'When Shams disappeared, Rumi poured his grief and longing into poetry — thousands of verses, often composed while spinning in a slow circle, which became the whirling dance of the dervishes.',
      'Eight centuries later he is one of the best-selling poets in the world. His central idea still lands: what you are seeking is also seeking you.',
    ],
  },
  'Vincent van Gogh': {
    author: 'Vincent van Gogh',
    era: '1853 – 1890',
    title: 'The painter almost nobody bought',
    paragraphs: [
      'Van Gogh didn’t pick up serious painting until he was 27. In the decade that followed he made nearly 900 paintings — and sold, as far as we know, only one in his lifetime.',
      'He painted through poverty, loneliness, and mental illness, kept alive largely by letters and money from his brother Theo. The wheat fields and starry nights we now line up for were, to him, a way to keep breathing.',
      'He died believing he had failed. Today his work hangs in the world’s great museums. His line about the paved road — comfortable, but no flowers grow — reads like a note he left for anyone tempted to play it safe.',
    ],
  },
  'Bruce Lee': {
    author: 'Bruce Lee',
    era: '1940 – 1973',
    title: 'Be water',
    paragraphs: [
      'Born in San Francisco and raised in Hong Kong, Lee was a restless kid who channeled street fights into martial arts. He studied philosophy at university and treated fighting as a thinking person’s art.',
      'Frustrated by rigid traditional styles, he built his own — Jeet Kune Do — around a single idea: absorb what is useful, discard what is not, add what is uniquely your own. Be formless, adaptable, like water.',
      'He broke barriers as an Asian lead in Hollywood and died suddenly at just 32, with only a handful of films finished. His influence on movies, martial arts, and mindset has only grown since.',
    ],
  },
  'Muhammad Ali': {
    author: 'Muhammad Ali',
    era: '1942 – 2016',
    title: 'The Greatest',
    paragraphs: [
      'Cassius Clay started boxing at 12 after his bike was stolen and he told a policeman he wanted to "whup" whoever took it. Within a decade he was Olympic champion and then heavyweight champion of the world.',
      'At the peak of his career he refused to be drafted into the Vietnam War on principle, was stripped of his title, and lost nearly four prime years of his career fighting the decision — which he ultimately won in the Supreme Court.',
      'He came back to reclaim the championship twice more. Loud, funny, and fearless, he counted the days by making each of them count — and became one of the most recognized people on earth.',
    ],
  },
};

export function storyFor(author: string | null | undefined): Story | undefined {
  if (!author) return undefined;
  return STORIES[author];
}

/* ------------------------------------------------------------------ */
/* Wallpaper presets — grayscale backgrounds for Studio                */
/* ------------------------------------------------------------------ */

export type PresetInk = 'light' | 'dark';

export type WallpaperPreset = {
  id: string;
  label: string;
  kind: 'solid' | 'gradient' | 'ruled' | 'dots';
  /** [top, bottom] for gradients; [fill, fill] for solids; base + mark for patterns. */
  colors: [string, string];
  /** Text colour that reads best on this background. */
  ink: PresetInk;
};

export const WALLPAPER_PRESETS: readonly WallpaperPreset[] = [
  { id: 'paper', label: 'Paper', kind: 'solid', colors: ['#FFFFFF', '#FFFFFF'], ink: 'dark' },
  { id: 'ink', label: 'Ink', kind: 'solid', colors: ['#0A0A0A', '#0A0A0A'], ink: 'light' },
  { id: 'fog', label: 'Fog', kind: 'gradient', colors: ['#FFFFFF', '#D9D9D9'], ink: 'dark' },
  { id: 'graphite', label: 'Graphite', kind: 'gradient', colors: ['#3A3A3A', '#050505'], ink: 'light' },
  { id: 'ruled', label: 'Ruled', kind: 'ruled', colors: ['#FCFCFC', '#DADADA'], ink: 'dark' },
  { id: 'dots', label: 'Dotgrid', kind: 'dots', colors: ['#111111', '#3A3A3A'], ink: 'light' },
];

export function presetById(id: string): WallpaperPreset {
  return WALLPAPER_PRESETS.find((p) => p.id === id) ?? WALLPAPER_PRESETS[0];
}
