# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> Expo SDK 57 changed significantly. Consult the versioned docs (https://docs.expo.dev/versions/v57.0.0/) before writing native/Expo code — APIs here do not match older SDKs.

## Commands

```bash
npm start          # Start Metro dev server (press i / a / w to open a target)
npm run ios        # Open in iOS simulator (requires Xcode)
npm run android    # Open in Android emulator (requires Android Studio)
npm run web        # Run in browser (static output)
npm run lint       # expo lint (generates ESLint config on first run)
npx expo-doctor    # Validate project/deps health
npm run reset-project  # Move starter code to app-example/ and blank out src/app — DESTRUCTIVE, only for a fresh start
npm run eval        # Prompt eval harness against the live model — see "Prompt engineering workflow" below
```

No UI/component test framework is configured yet. To add one, follow Expo's Jest guide before assuming `npm test` exists. There IS a prompt eval harness (`npm run eval`) — see below.

## Architecture

Expo (SDK ~57) + React Native (0.86) + TypeScript, using **Expo Router** file-based routing. App code lives under `src/` (not the repo root).

### Product surface (3 tabs + one overlay)

Quotable is a black-and-white, handwritten (Indie Flower) quotes app.

1. **Home** (`src/app/index.tsx`, route `index`) — the daily live-generated quote (Haiku via `src/lib/anthropic.ts`, with an offline fallback). Save / share / another. A header avatar button opens the Me overlay.
2. **Explore** (`src/app/explore.tsx`) — the app's center of gravity, in two screens. **Landing**: just the "Browse by category" tile grid (`TopicGrid`, topics in `constants/topics.ts` — separate from `MoodId`) plus search and a Following shortcut. **Category view**: after picking a topic (or Following, or typing a search), a clean Pinterest-style masonry of quote tiles (`CategoryTile`) for that selection — every post (whether it's a `FEED` social post or a plain `LIBRARY` quote, see `src/lib/explore-feed.ts`) renders the same clean way, no avatar/engagement chrome on the grid tile itself. Tapping a tile opens `PostDetailOverlay` (full attribution, like/save/share, comment/like counts); when the author has a life story, a "story →" opens `StoryOverlay` (e.g. Lincoln).
3. **Wallpaper** (`src/app/studio.tsx`, route `studio`) — the wallpaper maker. Compose a quote over a grayscale preset background or a picked photo, tune the type, then save to your studio or share. The live canvas + thumbnails are rendered by `WallpaperCanvas`.

**Me** (`src/components/profile-overlay.tsx`) is not a tab — profile photo + editable username + a **bio that is the user's favourite quote**, plus sections for favorites / liked / wallpapers / collections (grouped by mood). It's a full-screen overlay opened via `openProfile()` (`src/lib/profile-bus.ts`) from the avatar buttons on Home/Explore; there's no `src/app/profile.tsx` route.

- **Routing** — Screens are files in `src/app/`. `src/app/_layout.tsx` is the root layout: it keeps the tab navigator (`AppTabs`) mounted at all times and lays the onboarding flow (and the Me overlay) over it. `typedRoutes` is on, so route strings are type-checked (adding a tab = adding a file **and** a trigger in both `app-tabs` variants).
- **Navigation uses NATIVE tabs** — `src/components/app-tabs.tsx` renders `NativeTabs` from `expo-router/unstable-native-tabs` with SF Symbol icons. Tab trigger `name`s (`index`, `explore`, `studio`) must match files in `src/app/`. On iOS 26+, `NativeTabs` renders with system Liquid Glass automatically (it derives the tab bar background from the content behind it) — no glass-specific code needed, and `backgroundColor`/`indicatorColor`-style props only affect iOS 18 and earlier. Web has no native tab bar, so `app-tabs.web.tsx` approximates the look with `backdropFilter: blur()`.
- **Detail views are overlays, not routes** — because the root renders `NativeTabs` directly (no `Stack`), pushed detail screens (`StoryOverlay`, `PostDetailOverlay`, `ProfileOverlay`, `QuotePicker`) are implemented as **state-driven full-screen overlays**, not router routes. Follow this pattern for new detail views.
- **Cross-tab quote hand-off** — `src/lib/quote-bus.ts` is a one-slot external store; "make wallpaper" calls `sendToStudio(quote)` then `router.navigate('/studio')`, and Studio consumes the pending quote on render.
- **Platform-specific files** — Metro resolves `.web.tsx`/`.web.ts` over the plain `.tsx`/`.ts` on web. `app-tabs` (web draws a custom pill tab bar), `animated-icon`, and `use-color-scheme` have `.web` variants. When editing one variant, check the `.web` counterpart — **both `app-tabs` variants list the tabs and must stay in sync**.
- **Theming** — strict black-and-white *outside onboarding and Explore's photo categories*. `src/constants/theme.ts` exports `Palette.light/dark` (the accent is simply the opposite of the background — black on white / white on black), consumed via the `useBrand()` hook and a `makeStyles(c)` pattern. `BrandFonts.hand`/`.serif` = **Indie Flower** (the signature voice, loaded in `_layout.tsx`); `BrandFonts.sans` = Inter, kept only for tiny UI labels. The legacy `Colors` + `ThemedText` path still exists. `src/global.css` holds web-only font stacks.
  - **Onboarding is a deliberate exception**: `src/components/onboarding/` uses its own `OnboardingColors` palette (warm cream + coral/sunflower/sage/lavender accents) and `BrandFonts.urbanist*`, both in `theme.ts` but never mixed into `Palette`/`useBrand()`. This is intentional, not a bug — the user wants this palette to eventually become the whole app's theme, but that retheme hasn't happened yet; the other tabs are untouched.
  - **Explore is a second exception, in two parts**: (1) `BrandFonts.valley*` (Valley Sans) is used by Explore's own components (`explore.tsx`, `TopicGrid`, `SearchBar`, `Pill`, `CategoryTile`, `PostDetailOverlay`'s chrome) instead of Indie Flower/Inter — shared components Explore merely reuses (`PaperCard`, `WallpaperCanvas`, `StoryOverlay`) are left on the app-wide voice. (2) Anime/Politics/Workout (only — the rest are still monochrome placeholders) show **real, full-color photos** — see `constants/photos.ts` and the "Real photos" note below.
- **State + persistence** — `src/providers/app-state.tsx` holds all user data (prefs, favorites, liked, following, wallpapers, profile) and writes through to AsyncStorage via `src/lib/storage.ts`. Wallpapers are stored as **recipes** (`Wallpaper`: quote + presetId + optional photoUri + ink/align/fontScale), re-rendered anywhere by `WallpaperCanvas` — no image-file management. `wallpaperForQuote()` (`lib/explore-feed.ts`) builds one of these on the fly for any quote, preferring a curated real photo (`QUOTE_PHOTOS`) as `photoUri` over a grayscale preset when one exists.
- **Seeded content** — `src/constants/library.ts` holds all local content: `MOODS`, `LIBRARY` quotes (stable `lib-N` ids), `CREATORS`, `FEED` posts, `STORIES` (keyed by author name), and `WALLPAPER_PRESETS`. No backend. `src/constants/topics.ts` layers Explore's topic tags (`TopicId`: For You/Anime/Politics/Workout/Family/Music/Romance/Travel, `QUOTE_TOPICS` keyed by `lib-N` id) on top — curated separately from `MoodId`, which keeps driving Studio presets, onboarding, and quote-generation `Tone` untouched. Only Anime/Politics/Workout have real content + photos right now; Family/Travel are real clickable categories with nothing tagged yet (empty state), Music/Romance reuse quotes tagged for them but have no curated photos.
- **Real photos** (`src/constants/photos.ts`) — curated once, not fetched live: `CATEGORY_COVERS` (TopicGrid tile backgrounds) and `QUOTE_PHOTOS` (per-quote backgrounds, keyed by `lib-N` id) from two sources: Unsplash (`scripts/fetch-unsplash.ts` to search, `scripts/trigger-unsplash-download.ts` to ping `download_location` per their API Guidelines once a photo is actually kept) for covers and generic mood photography, and Wikimedia Commons (searched directly, license verified via its `imageinfo` API) for real portraits of quote authors — restricted to verified public-domain/CC-licensed images, never search-engine scraping, which carries no redistribution rights. `PostDetailOverlay` shows photographer + license credit whenever a quote has one.
- **React Compiler is enabled** (`experiments.reactCompiler` in `app.json`) — avoid manual `useMemo`/`useCallback` micro-optimizations; let the compiler handle memoization.

### Key dependencies added for v2

`@expo-google-fonts/indie-flower` (font), `expo-image-picker` (custom wallpaper photos + avatar — plugin configured in `app.json`), `expo-linear-gradient` (gradient presets), `react-native-view-shot` (capture a wallpaper to share; falls back to text share where capture is unsupported, e.g. web), `@expo-google-fonts/valley-sans` (Explore-only font, see Theming above).

## Prompt engineering workflow

Quotable has exactly one LLM call site: `generateQuote()` in `src/lib/anthropic.ts` (system prompt parameterized by `Tone`, structured JSON output). Its prompts are treated as versioned artifacts with a real eval harness, not just inline strings — because this is a mental-health app, "sounds fine to me" isn't a sufficient bar for a prompt change.

- **`prompts/`** — dated snapshots of the system/user prompt templates (`prompts/README.md` has the versioning convention: bump a version file, log what/why/eval-delta, every time the prompt changes). `src/lib/anthropic.ts` stays the executable source of truth; the files are the audit trail.
- **`evals/`** — the eval harness (`npm run eval`). Runs a small fixed input set (`evals/cases.ts`) against the live model and scores real output on: format compliance, refusal rate, a safety-flag pattern check, an LLM-as-judge quality score (Sonnet grading Haiku's output 1-5 on a rubric — judge is a stronger model than the one under test, on purpose), a diversity/anti-repetition check (reroll the same input, flag near-identical output), and average response length. Results land in `evals/results/history.jsonl` (git-tracked) so scores are comparable run over run.
- **Deliberately not BLEU/ROUGE-against-a-reference** as the quality metric — there is no single "correct" quote to diff against (rerolling the same input is *supposed* to produce something different), so reference-overlap metrics would penalize the exact behavior this app wants. `evals/README.md` has the full reasoning; the same overlap technique is reused instead as the diversity guard, where "too similar" (not "too different") is the failure mode.
- **Standing rule**: whenever you (Claude) change the system or user prompt in `src/lib/anthropic.ts`, reason about the change first (what's the hypothesis, what could regress), make the edit, run `npm run eval`, and report the before/after deltas (format compliance, refusal rate, avg judge score, avg length) against the previous line in `evals/results/history.jsonl` before calling the change done. Then version the prompt file per `prompts/README.md`. Requires `EXPO_PUBLIC_ANTHROPIC_API_KEY` in `.env.local` — the harness refuses to run without it rather than silently grading the offline fallback bank.

## Conventions

- **Path aliases**: `@/*` → `src/*`, `@/assets/*` → `assets/*` (see `tsconfig.json`). Prefer these over relative `../../` imports.
- **Filenames** are kebab-case (`themed-text.tsx`, `use-color-scheme.ts`).
- TypeScript is `strict`.
