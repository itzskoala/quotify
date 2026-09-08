/**
 * The "big gray" translucent circular back button — used both floating over
 * a photo in `PostDetailOverlay` and inline in Explore's category header.
 * One shared style so both read as the same control: a neutral gray reads
 * on any background (a pure black/white translucent circle would vanish
 * against a same-color screen in dark/light mode respectively).
 */
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { BackArrowIcon } from '@/components/post-icons';
import * as haptics from '@/lib/haptics';

type Props = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BackButton({ onPress, style }: Props) {
  return (
    <Pressable
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      hitSlop={12}
      style={[styles.circle, style]}>
      <BackArrowIcon color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(120,120,120,0.4)',
  },
});
