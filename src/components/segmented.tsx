/**
 * A minimal black-and-white segmented control. Selected segment inverts to the
 * ink accent. Used for Profile sections and any small tab-like switch.
 */
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';

type Props<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** Let the row scroll horizontally when it overflows. */
  scroll?: boolean;
};

export function Segmented<T extends string>({ options, value, onChange, scroll }: Props<T>) {
  const c = useBrand();
  const s = styles(c);

  const row = (
    <View style={s.row}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => {
              haptics.tap();
              onChange(opt.value);
            }}
            style={[s.seg, active && s.segActive]}>
            <ThemedText style={[s.label, active && s.labelActive]}>{opt.label}</ThemedText>
          </Pressable>
        );
      })}
    </View>
  );

  if (scroll) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}>
        {row}
      </ScrollView>
    );
  }
  return row;
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    scrollContent: {
      paddingHorizontal: Spacing.two,
    },
    row: {
      flexDirection: 'row',
      gap: Spacing.two,
    },
    seg: {
      paddingVertical: Spacing.two,
      paddingHorizontal: Spacing.three,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.line,
      backgroundColor: c.raised,
    },
    segActive: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    label: {
      fontFamily: BrandFonts.sansMedium,
      fontSize: 13,
      letterSpacing: 0.2,
      color: c.textDim,
    },
    labelActive: {
      color: c.onAccent,
    },
  });
