import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useBrand } from '@/hooks/use-brand';

/**
 * The five native tabs. Explore (the mood board) sits in the middle, as the
 * heart of browsing; Studio (wallpaper maker) and Feed flank it, Today and Me
 * bookend. Trigger `name`s must match route files in `src/app/`.
 */
export default function AppTabs() {
  const c = useBrand();

  return (
    <NativeTabs
      backgroundColor={c.bg}
      indicatorColor={c.accentSoft}
      labelStyle={{ selected: { color: c.accent } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="sun.max" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="feed">
        <NativeTabs.Trigger.Label>Feed</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="newspaper" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="square.grid.2x2" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="studio">
        <NativeTabs.Trigger.Label>Studio</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="wand.and.stars" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Me</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.crop.circle" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
