import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { ExploreIcon, HomeIcon, WallpaperIcon } from '@/components/tab-icons';
import { Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';

// react-native-web passes unknown style keys straight through to the DOM
// element's style — `backdropFilter` isn't in RN's `ViewStyle` type, but
// this is the web-only glass approximation for the tab bar (see the
// component doc comment).
const webGlass = {
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
} as unknown as ViewStyle;

/**
 * Web has no native tab bar, so no automatic iOS 26 Liquid Glass either (see
 * app-tabs.tsx). This approximates the look with a translucent pill +
 * `backdropFilter: blur()` — the closest honest equivalent on a platform
 * `expo-glass-effect`/native glass doesn't support. Icon-only, matching
 * app-tabs.tsx (no `Trigger.Label` there either) and the reference photo.
 */
export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton Icon={HomeIcon} />
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton Icon={ExploreIcon} />
          </TabTrigger>
          <TabTrigger name="studio" href="/studio" asChild>
            <TabButton Icon={WallpaperIcon} />
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

// TabList clones its props onto this root; `props.children` are the triggers,
// which the navigator must be able to discover — so they render directly here.
function CustomTabList(props: TabListProps) {
  const c = useBrand();
  const s = styles(c);
  return (
    <View {...props} style={s.container}>
      <View style={s.inner}>{props.children}</View>
    </View>
  );
}

function TabButton({
  isFocused,
  Icon,
  ...props
}: TabTriggerSlotProps & { Icon: (p: { color: string; size?: number }) => React.ReactNode }) {
  const c = useBrand();
  const s = styles(c);
  return (
    <Pressable {...props} style={({ pressed }) => [pressed && s.pressed]}>
      <View style={[s.tabButton, isFocused && s.tabButtonActive]}>
        <Icon color={isFocused ? c.onAccent : c.textDim} />
      </View>
    </Pressable>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      padding: Spacing.three,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    inner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      width: '100%',
      maxWidth: 260,
      paddingVertical: Spacing.two,
      paddingHorizontal: Spacing.three,
      borderRadius: 999,
      backgroundColor: c.bg === '#FFFFFF' ? 'rgba(255,255,255,0.72)' : 'rgba(0,0,0,0.62)',
      borderWidth: 1,
      borderColor: c.line,
      ...webGlass,
    },
    tabButton: {
      width: 40,
      height: 40,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabButtonActive: {
      backgroundColor: c.accent,
    },
    pressed: {
      opacity: 0.6,
    },
  });
