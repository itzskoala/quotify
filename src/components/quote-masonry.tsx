/**
 * A hand-rolled 2-column masonry (no extra dependency): each item goes into
 * whichever column currently has the smaller estimated height, Pinterest-
 * style. `estimateHeight` only needs to be roughly right — it drives
 * balance, not layout (each card still sizes itself normally).
 */
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';

type Props<T> = {
  items: readonly T[];
  keyExtractor: (item: T) => string;
  estimateHeight: (item: T) => number;
  renderItem: (item: T) => React.ReactNode;
};

export function QuoteMasonry<T>({ items, keyExtractor, estimateHeight, renderItem }: Props<T>) {
  const columns: T[][] = [[], []];
  const heights = [0, 0];

  for (const item of items) {
    const col = heights[0] <= heights[1] ? 0 : 1;
    columns[col].push(item);
    heights[col] += estimateHeight(item);
  }

  return (
    <View style={styles.row}>
      {columns.map((col, ci) => (
        <View key={ci} style={styles.column}>
          {col.map((item) => (
            <View key={keyExtractor(item)} style={styles.item}>
              {renderItem(item)}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  column: {
    flex: 1,
    gap: Spacing.two,
  },
  item: {},
});
