/**
 * The onboarding time picker: three synced scrolling wheels (hour, 5-minute
 * increments, AM/PM) instead of typed digits — natural on mobile, and it
 * can't produce an invalid time. Built from scratch with ScrollView + snap +
 * Reanimated scroll-driven opacity/scale (not a native picker library) so it
 * behaves identically on iOS, Android, and web — this app ships all three.
 *
 * The "onboarding variant" from the brief: a bracketed focal window sits
 * fixed at the vertical center: the row inside it reads full-strength, and
 * rows above/below fade and shrink the further they are from center.
 */
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { BrandFonts, OnboardingColors } from '@/constants/theme';
import type { NotifyTime } from '@/constants/quotable';
import * as haptics from '@/lib/haptics';

const ITEM_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const CENTER_INDEX = Math.floor(VISIBLE_ROWS / 2);
const COLUMN_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;
const PADDING = ITEM_HEIGHT * CENTER_INDEX;

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
const MERIDIEMS = ['AM', 'PM'];

function to24Hour(hour12: number, meridiem: 'AM' | 'PM'): number {
  if (meridiem === 'AM') return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

function to12Hour(hour24: number): { hour12: number; meridiem: 'AM' | 'PM' } {
  const meridiem: 'AM' | 'PM' = hour24 < 12 ? 'AM' : 'PM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour12, meridiem };
}

type ColumnProps = {
  data: string[];
  index: number;
  onSettle: (index: number) => void;
  accent: string;
};

/** One scrollable wheel — hour, minute, or AM/PM. */
function WheelColumn({ data, index, onSettle, accent }: ColumnProps) {
  const scrollY = useSharedValue(index * ITEM_HEIGHT);
  // Reanimated's ScrollView ref type doesn't resolve cleanly through
  // ComponentRef; it forwards to the underlying RN ScrollView's imperative
  // handle (scrollTo) at runtime, so a loose ref type is the pragmatic fit.
  const scrollRef = useRef<any>(null);
  const mounted = useRef(false);

  // Scroll to the initial value once; never fight the user's own scrolling
  // on subsequent prop updates (that only happens via onSettle → parent
  // state → this same index, which is already where the wheel sits).
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function settle(offsetY: number) {
    const settledIndex = Math.min(data.length - 1, Math.max(0, Math.round(offsetY / ITEM_HEIGHT)));
    haptics.soft();
    onSettle(settledIndex);
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      runOnJS(settle)(event.contentOffset.y);
    },
    onEndDrag: (event) => {
      // Covers the case a drag ends with no momentum (velocity ~0).
      if (Math.abs(event.velocity?.y ?? 0) < 0.05) {
        runOnJS(settle)(event.contentOffset.y);
      }
    },
  });

  return (
    <View style={styles.column}>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: PADDING }}>
        {data.map((label, i) => (
          <WheelRow key={label} label={label} rowIndex={i} scrollY={scrollY} accent={accent} />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

function WheelRow({
  label,
  rowIndex,
  scrollY,
  accent,
}: {
  label: string;
  rowIndex: number;
  scrollY: SharedValue<number>;
  accent: string;
}) {
  const style = useAnimatedStyle(() => {
    const centerFloat = scrollY.value / ITEM_HEIGHT;
    const distance = Math.abs(rowIndex - centerFloat);
    return {
      opacity: interpolate(distance, [0, 1, 2], [1, 0.42, 0.16], Extrapolation.CLAMP),
      transform: [{ scale: interpolate(distance, [0, 1, 2], [1, 0.86, 0.76], Extrapolation.CLAMP) }],
    };
  });

  return (
    <Animated.View style={[styles.row, style]}>
      <ThemedText style={[styles.rowLabel, { color: accent }]}>{label}</ThemedText>
    </Animated.View>
  );
}

type Props = {
  value: NotifyTime;
  onChange: (value: NotifyTime) => void;
  accent: string;
};

export function WheelTimePicker({ value, onChange, accent }: Props) {
  const { hour12, meridiem } = to12Hour(value.hour);
  const hourIndex = hour12 - 1;
  const minuteIndex = Math.round(value.minute / 5) % 12;
  const meridiemIndex = meridiem === 'AM' ? 0 : 1;

  function commit(next: { hourIndex: number; minuteIndex: number; meridiemIndex: number }) {
    const nextHour12 = next.hourIndex + 1;
    const nextMinute = next.minuteIndex * 5;
    const nextMeridiem: 'AM' | 'PM' = next.meridiemIndex === 0 ? 'AM' : 'PM';
    onChange({ hour: to24Hour(nextHour12, nextMeridiem), minute: nextMinute });
  }

  return (
    <View style={styles.wrap}>
      <View pointerEvents="none" style={[styles.focalWindow, { borderColor: accent }]} />
      <WheelColumn
        data={HOURS}
        index={hourIndex}
        accent={accent}
        onSettle={(i) => commit({ hourIndex: i, minuteIndex, meridiemIndex })}
      />
      <ThemedText style={styles.colon}>:</ThemedText>
      <WheelColumn
        data={MINUTES}
        index={minuteIndex}
        accent={accent}
        onSettle={(i) => commit({ hourIndex, minuteIndex: i, meridiemIndex })}
      />
      <WheelColumn
        data={MERIDIEMS}
        index={meridiemIndex}
        accent={accent}
        onSettle={(i) => commit({ hourIndex, minuteIndex, meridiemIndex: i })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: COLUMN_HEIGHT,
  },
  column: {
    height: COLUMN_HEIGHT,
    width: 64,
  },
  row: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontFamily: BrandFonts.urbanistBold,
    fontSize: 24,
  },
  colon: {
    fontFamily: BrandFonts.urbanistBold,
    fontSize: 24,
    color: OnboardingColors.ink,
    marginHorizontal: -4,
  },
  focalWindow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: CENTER_INDEX * ITEM_HEIGHT,
    height: ITEM_HEIGHT,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderRadius: 8,
  },
});
