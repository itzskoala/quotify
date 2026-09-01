# Quotable

Give someone the quote they need to hear right now — a live, AI-generated line
matched to what's on their mind and the time of day.

## The MVP, mapped to the design framework

- **Core function** — a live quote (Claude Haiku 4.5) tuned to the user's pain points, preferred voice, and time of day.
- **Core loop** — receive a quote → connect → **save** / share it.
- **Surface check** — three surfaces: Onboarding → Today → Saved.
- **Retention hook** — a daily push notification at the user's chosen time.
- **Texture** — warm paper + ink with a **terracotta** signature accent (Instrument Serif + Inter, hand-drawn line doodles); fully themed light (warm paper) / dark (ink) via `useBrand()`, plus haptics and ASMR sound hooks.

## Onboarding is a conversation, not a quiz

Three quiet questions: *what's weighing on you?* (multi-select, or none) → a scenario
question that infers the **voice** you respond to (gentle / direct / reflective / warm)
without asking outright → *when do you want a nudge?* Pain points + voice feed the quote prompt.

## Setup

1. Install deps: `npm install`
2. Add your Anthropic key so quotes generate live:
   ```bash
   cp .env.example .env.local
   # edit .env.local and set EXPO_PUBLIC_ANTHROPIC_API_KEY
   ```
   Without a key the app still runs — the Today screen falls back to a bundled
   set of quotes so nothing is ever empty.
3. Run it:
   - `npm run ios` — iOS simulator (needs full Xcode; this is a dev build, not
     Expo Go, because Quotable uses native modules: notifications, audio, native tabs).
   - `npm run web` — quick preview in a browser (native-only bits — haptics,
     sound, notifications — no-op on web).

## Where things live

- `src/lib/anthropic.ts` — live quote generation (Messages API over `fetch`) + local fallback.
- `src/lib/{notifications,haptics,sound,storage}.ts` — the retention + texture + persistence libs.
- `src/providers/app-state.tsx` — shared prefs + favorites.
- `src/components/onboarding/` — the 3-step onboarding.
- `src/app/index.tsx` (Today) · `src/app/explore.tsx` (Saved) — the two tabs.
- `src/constants/quotable.ts` — needs, notify presets, shared types.

## Sounds

`assets/sounds/chime.wav` and `squish.wav` ship as **silent placeholders** so
the app is runnable today. Drop real ASMR audio in at those paths (keep the
filenames) and the chime/squish come alive with no code change.

## Security note

For this personal MVP the Anthropic key ships in the client bundle via
`EXPO_PUBLIC_ANTHROPIC_API_KEY`. That's fine for a personal build but **not** for
public release. Before shipping, put quote generation behind a thin proxy and
point `API_URL` in `src/lib/anthropic.ts` at it — nothing else needs to change.

## Deferred (phase 2)

Send-to-friend beyond the native share sheet, wallpaper maker, "story behind the
person," calendar (gcal/ical) integration, custom notify times, and stage-of-life
personalization. The data model leaves room for these (e.g. `Quote.hasStory`).
