# Explore rebuild: Pinterest+Goodreads feed, 3-tab nav, glass tab bar

## Prompt

User asked to reference the 2026-09-03 onboarding-v4 dev-log entry as
context, then build the MVP further:

1. Bottom nav trimmed to 3 icons: Home, Explore, Wallpaper.
2. A "liquid glass" tab bar effect — initially requested via
   `npx skillfish add wjlgithub2021/wjl-agent-skills liquid-glass-tabs`.
3. Rebuild the Explore tab to feel like "Pinterest + Goodreads + a social
   feed, but entirely centered around quotes": a header ("Explore" /
   "Discover words worth remembering"), a search bar, horizontal topic
   pills (For You/Funny/Life/Love/Friendship/Work/Movies/Music/Random), a
   photo reference for the very first thing shown on the page, a Goodreads-
   style social-post card format, an image-pin card format, and a Pinterest-
   style scrollable masonry feed of quotes by category — with six reference
   screenshots.

Explicitly asked to be questioned first, then planned meticulously in plan
mode, with final say withheld until approved. Mid-plan, after seeing the
draft, corrected one thing: the "Browse by category" reference photo was
for the topic pills themselves (a tile grid), not a separate mood shelf —
"reference this photo when making the original pills." Also asked, mid-
build, to spin up a dev server once done.

## Response/plan

Read the codebase (`app-tabs` both variants, `explore.tsx`, `feed.tsx`,
`library.ts`, `theme.ts`, `paper-card.tsx`, `quote-actions.tsx`,
`app-state.tsx`, `_layout.tsx`, `profile.tsx`, `wallpaper-canvas.tsx`) before
asking anything. Surfaced two things before planning: `expo-glass-effect`
was already an installed-but-unused dependency (a safer first-party
alternative to the third-party skillfish install), and CLAUDE.md's strict
monochrome rule conflicted with the full-color reference photos. Asked four
`AskUserQuestion` questions (nav scope, glass implementation, theme, topic
taxonomy vs. `MoodId`) — user picked the recommended option on all four:
retire Feed into Explore, use `expo-glass-effect`/native glass, stay
monochrome, keep topics separate from moods.

Checked the versioned Expo SDK 57 docs (per AGENTS.md) before writing any
native-tabs code: found that `NativeTabs` renders iOS 26 Liquid Glass
*automatically* (system-derived from content behind it), and
`backgroundColor`/`indicatorColor`-style props only affect iOS 18 and
earlier — so the tab bar needed zero glass-specific code on iOS, just
trimming to 3 tabs. Wrote the plan, entered plan mode, then updated it
after the "reference this photo for the pills" correction: dropped a
separate "mood shelf" concept and made the 9 topics render as a Spotify/
Pinterest-style 2-row tile grid (`TopicGrid` + new `TopicArt` SVG glyphs)
instead of thin filter chips.

**Build**, in order:
- **Nav**: `app-tabs.tsx`/`app-tabs.web.tsx` trimmed to Home/Explore/
  Wallpaper (SF symbols `house`/`sparkle.magnifyingglass`/`wand.and.stars`);
  web gets a `backdropFilter: blur()` approximation since it has no native
  glass. Deleted `src/app/feed.tsx`.
- **Profile → overlay**: new `lib/profile-bus.ts` (one-slot external store,
  mirrors `quote-bus.ts`), new `components/profile-overlay.tsx` (the old
  `app/profile.tsx` body + a StoryOverlay-style close bar), wired into
  `_layout.tsx` next to the onboarding overlay. Avatar buttons added to
  Home's and Explore's headers. Deleted `src/app/profile.tsx`.
- **Topics**: new `constants/topics.ts` — `TopicId`, `TOPICS`, and a
  hand-curated `QUOTE_TOPICS` map keyed by `lib-N` id (like `STORIES` is
  keyed by author). Authored 18 new `LIBRARY` quotes to cover topics with
  no natural home in the old 7 moods (funny/life/friendship/work/music/
  random), kept on the closest-toned existing `MoodId` for Studio/tone.
- **Shared UI**: extracted `Pill` out of `quote-actions.tsx` into its own
  component; new `TopicArt` (9 bespoke SVG glyphs, sibling to the existing
  `MoodArt` pattern — then deleted `mood-art.tsx` itself once nothing
  referenced it anymore), `TopicGrid`, `SearchBar`, `QuoteMasonry` (hand-
  rolled 2-column greedy-height-balance masonry, no new dependency),
  `ExploreCardSocial`, `ExploreCardPin`, `PostDetailOverlay`.
- **Feed data**: new `lib/explore-feed.ts` — `FEED` posts become "social"
  cards (real creator), every other `LIBRARY` quote becomes a "pin" card (a
  `WallpaperCanvas` thumbnail, cycling `WALLPAPER_PRESETS`), with
  deterministic seeded comment/share counts and topic/search/following
  filtering.
- **`explore.tsx`** rewritten around all of the above.
- **Docs**: updated CLAUDE.md's "Product surface" section (5 tabs → 3 tabs +
  Me overlay), `quote-bus.ts`'s comment, `story-overlay.tsx`'s comment.

**Bugs caught during browser verification** (`npx expo start --web` driven
via claude-in-chrome, per the plan's verification phase):
1. Pin cards hardcoded `ink: 'light'` regardless of the chosen preset — on
   a light preset (paper/fog/ruled) the quote text rendered as white-on-
   white, invisible. Fixed to read `presetById(presetId).ink`.
2. The masonry feed had no max-width cap on wide/web viewports, so a pin
   card's `aspectRatio`-driven height ballooned (~900px tall on a 1500px
   window) and its vertically-centered text scrolled below the visible
   area, looking blank. Fixed by applying the app's existing
   `MaxContentWidth` convention (same pattern as `app-tabs.web.tsx` and
   onboarding) to Explore's header and feed content.

Verified end-to-end in the browser after both fixes: topic tile filtering,
search, the following toggle (including its empty state), tapping both card
kinds into `PostDetailOverlay`, the story-overlay chain (Lincoln), like
actually flipping state and persisting into the profile overlay's "liked"
count, the wallpaper hand-off (`sendToStudio`) landing the right quote in
Studio, and all three tabs (Home/Explore/Wallpaper) rendering cleanly. `tsc`
and `npm run lint` both clean throughout.

## Outcome

Did not run the third-party `skillfish` install — used the plan's
`expo-glass-effect`/native-glass alternative instead, which turned out to
need no extra code at all on iOS. Spun up `npx expo start --web` in the
background per the user's mid-build request; left it running at
`localhost:8081` rather than killing it after verification. Did not touch
`src/lib/anthropic.ts` this session, so the prompt-eval standing rule
(`npm run eval`, version the prompt file) doesn't apply here.
