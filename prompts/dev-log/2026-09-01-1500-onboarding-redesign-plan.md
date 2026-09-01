## Prompt

> I'd like you create an onboarding for this app. I'd like for the onboarding
> to be beautiful, eye catching, and asks the right questions for this
> application. Look at what i have so far, the whole idea is spike their
> interest through the questions / interesting facts, and finally at the end
> we give them the subscription model and then ask for their name, and when
> they'd like to receive notifications with an interactive slider
>
> communicate how the app benefits the user, rather than just listing its
> features.
>
> Screen 1: The Core Value — Headline: "Daily Wisdom for Your Mind." Subtext:
> benefit-not-feature framing. Visual: minimalist illustration of peace/focus.
> Screen 2: Personalization & Categories — tap-to-select pills/cards (e.g.
> Motivation, Stoicism, Mindfulness, Success). Screen 3: Daily Reminders
> (optional) — prompt for notification time, "skip for now" to build trust.
>
> do this: the dynamic wheel / time picker — a classic vertical scrolling
> wheel for hours, minutes, AM/PM, feels natural on mobile, prevents invalid
> entries. Onboarding variant: highlight the chosen time in a central focal
> window, slightly blurring the options above/below.
>
> first tell me your plan ALWAYS tell me your plan (this is what i want
> recorded in the prompts)

## Response/plan

Read the existing onboarding v2 implementation first (`onboarding-flow.tsx`,
`welcome.tsx`, `notify-setup.tsx`, `onboarding-scaffold.tsx`, `option-card.tsx`,
`onboarding-pill.tsx`, `illustrations.tsx`, `theme.ts`'s `OnboardingColors`,
`app-state.tsx`, `storage.ts`, `notifications.ts`, `constants/quotable.ts`,
`constants/library.ts`'s `MOODS`) to ground the plan in what's actually there
rather than guessing. Confirmed via grep that `NotifyPreset`, `OnboardingProfile`,
and `VIBE_TO_TONE` are only read inside onboarding/storage/notifications/app-state
— nothing in `profile.tsx` or elsewhere depends on them — so replacing the
current 7-question flow outright (rather than extending it) is safe.

Decided to **replace** the existing goal → entryReason → experience →
lifeFocus → vibe → thinkers → notify sequence with the leaner flow the user
specified:

1. **Welcome / Core Value** — rewrite `welcome.tsx`. Headline "Daily Wisdom
   for Your Mind," subtext written as a benefit, not a feature list. Calm
   illustration, no progress dots (matches current intro treatment).
2. **Personalization** — new `categories.tsx`, tap-to-select pill grid over
   the app's *existing* mood taxonomy (`MoodId` from `library.ts`: motivation,
   workout, romance, anime, movies, calm, wisdom) rather than inventing a
   parallel topic list — this is the same taxonomy driving Explore's mood
   board and wallpaper presets, so the personalization is load-bearing.
   Persisted as `preferredMoods`; also replaces `VIBE_TO_TONE` with a new
   `MOOD_TO_TONE` so Today's live quote tone still gets a signal without a
   dedicated vibe question.
3. **Paywall / Subscription** — new `paywall.tsx`. Benefit-led plan cards,
   "Continue" + small "not now" skip link (never hard-blocks). Flagged as an
   open question for the user: build as a UI-only mock (no real purchase
   flow) vs. wire real IAP (RevenueCat + App Store/Play product config +
   native dev build) — materially different scope, needs their call before
   starting.
4. **Name** — new `name.tsx`. Single input, writes to `profile.username` via
   `updateProfile`.
5. **Notification time** — new `notify-time.tsx` + a new shared
   `wheel-time-picker.tsx`: three synced scrollable wheel columns (hour,
   5-minute increments, AM/PM) built with `ScrollView` + snap + a
   Reanimated-driven opacity/scale falloff so rows blur out above/below a
   bracketed center focal window, matching the user's described interaction
   exactly. Deliberately custom-built (not a native picker library) so it
   behaves identically on iOS/Android/web, since this app ships a web build
   too. "Skip for now" defaults to 9:00 AM and still schedules.

Data model changes planned: `constants/quotable.ts` drops
`Goal/EntryReason/PriorExperience/LifeFocusArea/Vibe/ThinkerCategory` + their
option maps + `VIBE_TO_TONE`, adds `MOOD_TO_TONE`; `NotifyPreset` (3 buckets)
becomes a plain `{hour, minute}`; `OnboardingProfile` shrinks to
`{ preferredMoods }`; `notifications.ts`'s `scheduleDailyQuote` takes
`{hour, minute}` instead of a preset. Files to delete: `goal.tsx`,
`entry-reason.tsx`, `experience-level.tsx`, `life-focus.tsx`, `vibe.tsx`,
`favorite-thinkers.tsx`. New: `categories.tsx`, `mood-chip.tsx`, `paywall.tsx`,
`name.tsx`, `wheel-time-picker.tsx`. Stays as-is: `OnboardingScaffold`,
`OnboardingPill`, `illustrations.tsx`, the `OnboardingColors`/Urbanist system
(already scoped for exactly this per CLAUDE.md's onboarding-palette note).

Presented this plan to the user in full before writing any code (per their
explicit standing instruction to always share the plan first), then asked one
blocking clarifying question via AskUserQuestion: mock paywall UI vs. real
RevenueCat IAP integration.

## Outcome

Pending — plan presented, clarifying question asked, no code written yet.
