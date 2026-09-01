import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandFonts, MaxContentWidth, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>today</TabButton>
          </TabTrigger>
          <TabTrigger name="feed" href="/feed" asChild>
            <TabButton>feed</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>explore</TabButton>
          </TabTrigger>
          <TabTrigger name="studio" href="/studio" asChild>
            <TabButton>studio</TabButton>
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton>me</TabButton>
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
      <View style={s.inner}>
        <Text style={s.brand}>quotable</Text>
        <View style={s.tabs}>{props.children}</View>
      </View>
    </View>
  );
}

function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  const c = useBrand();
  const s = styles(c);
  return (
    <Pressable {...props} style={({ pressed }) => [pressed && s.pressed]}>
      <View style={[s.tabButton, isFocused && s.tabButtonActive]}>
        <Text style={[s.tabLabel, isFocused && s.tabLabelActive]}>{children}</Text>
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
      justifyContent: 'space-between',
      flexGrow: 1,
      maxWidth: MaxContentWidth,
      paddingVertical: Spacing.two,
      paddingHorizontal: Spacing.three,
      borderRadius: 999,
      backgroundColor: c.raised,
      borderWidth: 1,
      borderColor: c.line,
    },
    brand: {
      fontFamily: BrandFonts.serif,
      fontSize: 24,
      color: c.text,
    },
    tabs: {
      flexDirection: 'row',
      gap: Spacing.one,
    },
    tabButton: {
      paddingVertical: Spacing.one,
      paddingHorizontal: Spacing.two,
      borderRadius: 999,
    },
    tabButtonActive: {
      backgroundColor: c.accent,
    },
    tabLabel: {
      fontFamily: BrandFonts.sans,
      fontSize: 14,
      color: c.textDim,
    },
    tabLabelActive: {
      color: c.onAccent,
    },
    pressed: {
      opacity: 0.6,
    },
  });
