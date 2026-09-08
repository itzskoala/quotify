import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useBrand } from '@/hooks/use-brand';

/**
 * The three native tabs: Home (Today's live quote), Explore (the Pinterest-
 * style topic/masonry feed — now also where Feed's "following" lane lives),
 * and Wallpaper (Studio). Trigger `name`s must match route files in
 * `src/app/`. Me/profile is no longer a tab — it's an avatar-triggered
 * overlay (see `profile-bus.ts` / `profile-overlay.tsx`), reached from the
 * Home and Explore headers.
 *
 * Icon-only — no `Trigger.Label`, per the reference the user wants (a plain
 * icon row, not a labeled tab bar).
 *
 * No manual glass-effect code here: on iOS 26+, `NativeTabs` renders with
 * system Liquid Glass automatically (it derives the tab bar's background
 * from the content behind it) — `backgroundColor`/`indicatorColor`-style
 * props only affect iOS 18 and earlier and can't override it. See
 * `app-tabs.web.tsx` for web's CSS approximation, since there's no native
 * glass to fall back on there.
 */
export default function AppTabs() {
  const c = useBrand();

  return (
    <NativeTabs backgroundColor={c.bg} indicatorColor={c.accentSoft}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf="house" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Icon sf="sparkle.magnifyingglass" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="studio">
        <NativeTabs.Trigger.Icon sf="wand.and.stars" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
