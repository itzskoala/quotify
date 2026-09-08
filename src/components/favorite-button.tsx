/**
 * The lavender-cream "Favorite" pill in `PostDetailOverlay`'s engagement
 * row — tapping it opens `LibraryPicker` (Spotify's "Add to Playlist" sheet
 * is the reference), not a direct single-favorite toggle. The pill itself
 * stays lit whenever the quote is saved *anywhere* — Favorites or any
 * user-created library.
 */
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { LibraryPicker } from '@/components/library-picker';
import { ThemedText } from '@/components/themed-text';
import type { Quote } from '@/constants/quotable';
import { BrandFonts, Spacing } from '@/constants/theme';
import * as haptics from '@/lib/haptics';
import { useAppState } from '@/providers/app-state';

type Props = { quote: Quote };

const LAVENDER_CREAM = '#EFE3F5';
const LAVENDER_DEEP = '#B79ED6';
const PLUM = '#6B4E8C';

export function FavoriteButton({ quote }: Props) {
  const { isSaved, libraries } = useAppState();
  const [open, setOpen] = useState(false);
  const savedAnywhere = isSaved(quote) || libraries.some((lib) => lib.quotes.some((q) => sameText(q, quote)));

  return (
    <>
      <Pressable
        onPress={() => {
          haptics.tap();
          setOpen(true);
        }}
        style={[styles.pill, savedAnywhere && styles.pillActive]}>
        <ThemedText style={[styles.label, savedAnywhere && styles.labelActive]}>
          {savedAnywhere ? '✓ favorited' : 'favorite'}
        </ThemedText>
      </Pressable>

      <LibraryPicker visible={open} quote={quote} onClose={() => setOpen(false)} />
    </>
  );
}

function sameText(a: Quote, b: Quote): boolean {
  return a.text.trim() === b.text.trim();
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: 999,
    backgroundColor: LAVENDER_CREAM,
  },
  pillActive: {
    backgroundColor: LAVENDER_DEEP,
  },
  label: {
    fontFamily: BrandFonts.valleyMedium,
    fontSize: 13,
    color: PLUM,
  },
  labelActive: {
    color: '#FFFFFF',
  },
});
