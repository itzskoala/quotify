/**
 * Explore's search bar — filters the feed client-side by quote text, author,
 * or creator name/handle. No separate people/topics results view for this
 * pass, just the one text field.
 */
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export function SearchBar({ value, onChangeText }: Props) {
  const c = useBrand();
  const s = styles(c);
  return (
    <View style={s.bar}>
      <ThemedText style={s.glyph}>🔍</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="search quotes, people, topics..."
        placeholderTextColor={c.textFaint}
        style={s.input}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <ThemedText style={s.clear}>✕</ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
      paddingVertical: Spacing.two,
      paddingHorizontal: Spacing.three,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.line,
      backgroundColor: c.raised,
    },
    glyph: {
      fontSize: 14,
    },
    input: {
      flex: 1,
      fontFamily: BrandFonts.valley,
      fontSize: 14,
      color: c.text,
      padding: 0,
    },
    clear: {
      fontFamily: BrandFonts.valleyMedium,
      fontSize: 13,
      color: c.textFaint,
    },
  });
