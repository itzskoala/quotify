/**
 * The secondary actions row under a quote in `PostDetailOverlay`: send to
 * Studio as a wallpaper, and — when the author has one — open their story.
 * Liking and favoriting live separately now, as prominent primary controls
 * next to the photo (`LikeHeart`, the Favorite button).
 */
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Pill } from '@/components/pill';
import type { Quote } from '@/constants/quotable';
import { Spacing } from '@/constants/theme';
import * as haptics from '@/lib/haptics';
import { sendToStudio } from '@/lib/quote-bus';

type Props = {
  quote: Quote;
  onStory?: () => void;
};

export function QuoteActions({ quote, onStory }: Props) {
  return (
    <View style={styles.row}>
      <Pill
        label="▢ wallpaper"
        onPress={() => {
          haptics.tap();
          sendToStudio(quote);
          router.navigate('/studio');
        }}
      />
      {onStory ? (
        <Pill
          label="story →"
          emphasis
          onPress={() => {
            haptics.soft();
            onStory();
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
  },
});
