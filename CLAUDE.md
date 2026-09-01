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

### Product surface (5 tabs)

Quotable is a black-and-white, handwritten (Indie Flower) quotes app. The tab order intentionally puts **Explore in the middle**:

1. **Today** (`src/app/index.tsx`) — the daily live-generated quote (Haiku via `src/lib/anthropic.ts`, with an offline fallback). Save / share / another.
2. **Feed** (`src/app/feed.tsx`) — a news feed of quotes posted by seeded `quotableCreators` you can follow. When a quote's author has a life story, a "story →" opens `StoryOverlay` (the "read the person behind the quote" moment, e.g. Lincoln).
3. **Explore** (`src/app/explore.tsx`) — the **Mood Board**: quotes grouped by mood (motivation / workout / romance / anime / movies / calm / wisdom).
4. **Studio** (`src/app/studio.tsx`) — the **wallpaper maker**. Compose a quote over a grayscale preset background or a picked photo, tune the type, then save to your studio or share. The live canvas + thumbnails are rendered by `WallpaperCanvas`.
5. **Me** (`src/app/profile.tsx`) — profile photo + editable username + a **bio that is the user's favourite quote**, plus sections for favorites / liked / wallpapers / collections (grouped by mood).

- **Routing** — Screens are files in `src/app/`. `src/app/_layout.tsx` is the root layout: it keeps the tab navigator (`AppTabs`) mounted at all times and lays the onboarding flow over it as an overlay. `typedRoutes` is on, so route strings are type-checked (adding a tab = adding a file **and** a trigger in both `app-tabs` variants).
- **Navigation uses NATIVE tabs** — `src/components/app-tabs.tsx` renders `NativeTabs` from `expo-router/unstable-native-tabs` with SF Symbol icons. Tab trigger `name`s (`index`, `feed`, `explore`, `studio`, `profile`) must match files in `src/app/`.
- **Detail views are overlays, not routes** — because the root renders `NativeTabs` directly (no `Stack`), pushed detail screens (`StoryOverlay`, `QuotePicker`) are implemented as **state-driven full-screen overlays**, not router routes. Follow this pattern for new detail views.
- **Cross-tab quote hand-off** — `src/lib/quote-bus.ts` is a one-slot external store; "make wallpaper" calls `sendToStudio(quote)` then `router.navigate('/studio')`, and Studio consumes the pending quote on render.
- **Platform-specific files** — Metro resolves `.web.tsx`/`.web.ts` over the plain `.tsx`/`.ts` on web. `app-tabs` (web draws a custom pill tab bar), `animated-icon`, and `use-color-scheme` have `.web` variants. When editing one variant, check the `.web` counterpart — **both `app-tabs` variants list the tabs and must stay in sync**.
- **Theming** — strict black-and-white *outside onboarding*. `src/constants/theme.ts` exports `Palette.light/dark` (the accent is simply the opposite of the background — black on white / white on black), consumed via the `useBrand()` hook and a `makeStyles(c)` pattern. `BrandFonts.hand`/`.serif` = **Indie Flower** (the signature voice, loaded in `_layout.tsx`); `BrandFonts.sans` = Inter, kept only for tiny UI labels. The legacy `Colors` + `ThemedText` path still exists. `src/global.css` holds web-only font stacks.
  - **Onboarding is a deliberate exception**: `src/components/onboarding/` uses its own `OnboardingColors` palette (warm cream + coral/sunflower/sage/lavender accents) and `BrandFonts.urbanist*`, both in `theme.ts` but never mixed into `Palette`/`useBrand()`. This is intentional, not a bug — the user wants this palette to eventually become the whole app's theme, but that retheme hasn't happened yet; the other 4 tabs are untouched.
- **State + persistence** — `src/providers/app-state.tsx` holds all user data (prefs, favorites, liked, following, wallpapers, profile) and writes through to AsyncStorage via `src/lib/storage.ts`. Wallpapers are stored as **recipes** (`Wallpaper`: quote + presetId + optional photoUri + ink/align/fontScale), re-rendered anywhere by `WallpaperCanvas` — no image-file management.
- **Seeded content** — `src/constants/library.ts` holds all local content: `MOODS`, `LIBRARY` quotes (stable `lib-N` ids), `CREATORS`, `FEED` posts, `STORIES` (keyed by author name), and `WALLPAPER_PRESETS`. No backend.
- **React Compiler is enabled** (`experiments.reactCompiler` in `app.json`) — avoid manual `useMemo`/`useCallback` micro-optimizations; let the compiler handle memoization.

### Key dependencies added for v2

`@expo-google-fonts/indie-flower` (font), `expo-image-picker` (custom wallpaper photos + avatar — plugin configured in `app.json`), `expo-linear-gradient` (gradient presets), `react-native-view-shot` (capture a wallpaper to share; falls back to text share where capture is unsupported, e.g. web).

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
