# Onboarding v4: from-scratch monochrome rebuild

## Prompt

User (self-described overthinker) asked to refactor Quotable's onboarding
from scratch, screen by screen: monochrome/charcoal-grey palette instead of
the v3 warm palette ("calming, not stimulating — this is a mental-health
app"), Google Sans for headers, and a specific 7-screen spec dictated in
one long message:

1. Splash — "quotable!" / "your pocket cheerleader" / white "be quotable" button / skip ×
2. Value prop sentence + hand-drawn illustration (book, sunflower, two stick figures)
3. "What inspires you?" — 6 category boxes (Sports/Meditation/Politics/Religion/Anime/+1)
4. If Religion picked → "What do you practice?" emoji list sub-screen
5. "How old are you?" — slider 16–75+
6. Expectations screen — icon row (wallpaper/music/chess/mountain climber)
7. "One quote a day keeps the inspiration at bay!" — 3 mock notification
   previews (a joke one from "Saul Goodman," a religious one, a sports one)
8. CEO thank-you screen — "be quotable!" final button

Also asked for: a back arrow on every screen but the first, Figma
wireframes (later clarified: build them for real in Figma via the `figma`
MCP plugin, not a Claude Design canvas mockup), and sound effects
throughout via the ElevenLabs `sound-effects` skill. Explicitly: cut the
existing paywall + login/signup screens from onboarding entirely, and
"the monochrome is an experiment for the onboarding for now" — not a
decision to retheme the rest of the app.

## Response/plan

Two-phase build:

**Phase 1 — Figma.** Authenticated the `figma` MCP plugin, created a
"Wireframes for Quotable" page, and built/screenshot-verified 4 screens
(Splash, Value Prop, Interests, Religion sub-screen) before hitting the
Starter-plan's 20-calls/month cap on read tools (screenshots/metadata) —
turns out write calls aren't exempt either, despite what the plan's own
exemption-list docs implied. User chose to finish the remaining screens
directly in code rather than upgrade the Figma seat.

**Phase 2 — code.** Rewrote `src/constants/theme.ts` (`OnboardingColors`
→ charcoal gradient + `gradientStops`, added `BrandFonts.googleSans*` via
the newly-open-sourced `@expo-google-fonts/google-sans-flex` — plain
"Google Sans" still isn't on Google Fonts, but the variable "Google Sans
Flex" is). Deleted `paywall.tsx`, `account.tsx`, `mood-chip.tsx`,
`notify-time.tsx`, `wheel-time-picker.tsx`, `illustrations.tsx`,
`categories.tsx`, `option-card.tsx` (dead code). Wrote new:
`skip-back-row.tsx` (shared back-chevron + skip-× control), rewritten
`onboarding-scaffold.tsx`/`onboarding-pill.tsx` (LinearGradient bg, white
solid/outline pills), `welcome.tsx` (splash, standalone layout),
`value-prop.tsx`, `interests.tsx` (new 6-category taxonomy, bridged back
to the app's real `MoodId`/`Tone` via `INTEREST_TO_MOOD` so Explore/quote
generation still work), `religion.tsx` (conditional branch), `age.tsx`
(`@react-native-community/slider`, 16–76 where 76 displays "75+"),
`expectations.tsx`, `notification-preview.tsx` (real quotes: Buddha,
Muhammad Ali; deliberate joke quote for the fictional "Saul Goodman"),
`cta-thankyou.tsx`, `stick-art.tsx` (hand-drawn react-native-svg
illustrations), and rewired `onboarding-flow.tsx` around a step *history
stack* (not a flat array) so back-navigation still works across the
conditional Religion branch. Extended `OnboardingProfile`
(`storage.ts`)/`OnboardingResult` (`app-state.tsx`) with optional
`religiousPractice`/`age`. No dedicated notify-time picker in v4 (cut with
paywall/account) — defaults to `DEFAULT_NOTIFY_TIME` (9:00 AM).

**Verification.** `tsc`/`lint` clean, then actually ran the app
(`npx expo start --web`, driven via claude-in-chrome) rather than trusting
the typecheck — caught two real bugs neither Figma nor tsc would have:
react-native-svg's `rotation`/`origin` shorthand throws an "Invalid DOM
property" warning on web (fixed by using `transform="rotate(deg,cx,cy)"`
instead), and onboarding had no web max-width constraint so wide viewports
stretched the Expectations icon row edge-to-edge (fixed by applying the
same `maxWidth: MaxContentWidth` pattern `app-tabs.web.tsx` already uses).
Clicked through the entire 8-screen flow twice end-to-end, including the
Religion branch and full completion → landed cleanly on the Today tab with
zero console errors.

**Bonus find.** User asked "where's the notification-allow screen?" —
there isn't one (it's the native OS dialog, not a custom screen), and
answering that surfaced a real pre-existing bug: `requestNotificationPermission()`
existed in `notifications.ts` but nothing ever called it, so
`scheduleDailyQuote()` silently failed for anyone who hadn't separately
granted permission. Fixed by calling it in `completeOnboarding()`.

## Outcome

Sound effects (`assets/sounds/chime.wav`/`squish.wav`) are still silent
placeholders — no `ELEVENLABS_API_KEY` in the env, and a suggested
alternate skill source (`skillfish add willsigmon/sigstack
sound-effects-expert`) pointed at a repo that doesn't exist. User said to
skip sound for now; all the trigger code (`sound.squish()` on every
`OnboardingPill`/`SkipBackRow` press, `sound.chime()` on completion) is
already wired, so real audio just needs dropping into the two existing
filenames whenever a key becomes available.
