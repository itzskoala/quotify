/**
 * The "story behind the person" reader. Slides up over the Feed when a quote
 * whose author has a Story is tapped: a portrait, their years, a short life,
 * and their other lines in the library.
 */
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { ThemedText } from '@/components/themed-text';
import { LIBRARY, type Story } from '@/constants/library';
import { BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';

type Props = {
  story: Story;
  onClose: () => void;
};

export function StoryOverlay({ story, onClose }: Props) {
  const c = useBrand();
  const s = styles(c);
  const otherLines = LIBRARY.filter((q) => q.author === story.author);

  return (
    <View style={s.screen}>
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <View style={s.topbar}>
          <Pressable
            onPress={() => {
              haptics.tap();
              onClose();
            }}
            hitSlop={12}
            style={s.close}>
            <ThemedText style={s.closeLabel}>✕  close</ThemedText>
          </Pressable>
          <ThemedText style={s.kicker}>the story</ThemedText>
        </View>

        <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
          <View style={s.portrait}>
            <Avatar name={story.author} size={96} filled />
          </View>
          <ThemedText style={s.name}>{story.author}</ThemedText>
          <ThemedText style={s.era}>{story.era}</ThemedText>
          <ThemedText style={s.title}>{story.title}</ThemedText>

          <View style={s.rule} />

          {story.paragraphs.map((p, i) => (
            <ThemedText key={i} style={s.para}>
              {p}
            </ThemedText>
          ))}

          {otherLines.length > 0 ? (
            <View style={s.linesBlock}>
              <ThemedText style={s.linesHeading}>in their words</ThemedText>
              {otherLines.map((q) => (
                <ThemedText key={q.id} style={s.line}>
                  “{q.text}”
                </ThemedText>
              ))}
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    screen: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: c.bg,
    },
    safe: {
      flex: 1,
    },
    topbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.two,
      paddingBottom: Spacing.two,
    },
    close: {
      paddingVertical: Spacing.one,
    },
    closeLabel: {
      fontFamily: BrandFonts.sansMedium,
      fontSize: 13,
      color: c.textDim,
      letterSpacing: 0.3,
    },
    kicker: {
      fontFamily: BrandFonts.sans,
      fontSize: 12,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: c.textFaint,
    },
    body: {
      alignItems: 'center',
      paddingHorizontal: Spacing.four,
      paddingBottom: Spacing.six,
    },
    portrait: {
      marginTop: Spacing.three,
      marginBottom: Spacing.three,
    },
    name: {
      fontFamily: BrandFonts.hand,
      fontSize: 40,
      lineHeight: 46,
      color: c.text,
      textAlign: 'center',
    },
    era: {
      fontFamily: BrandFonts.sans,
      fontSize: 13,
      letterSpacing: 1,
      color: c.textDim,
      marginTop: Spacing.one,
    },
    title: {
      fontFamily: BrandFonts.hand,
      fontSize: 22,
      color: c.textDim,
      marginTop: Spacing.two,
      textAlign: 'center',
    },
    rule: {
      width: 40,
      height: 2,
      backgroundColor: c.accent,
      marginVertical: Spacing.four,
      borderRadius: 2,
    },
    para: {
      fontFamily: BrandFonts.sans,
      fontSize: 16,
      lineHeight: 26,
      color: c.text,
      marginBottom: Spacing.three,
      alignSelf: 'stretch',
    },
    linesBlock: {
      alignSelf: 'stretch',
      marginTop: Spacing.three,
      paddingTop: Spacing.four,
      borderTopWidth: 1,
      borderTopColor: c.line,
      gap: Spacing.three,
    },
    linesHeading: {
      fontFamily: BrandFonts.sans,
      fontSize: 12,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: c.textFaint,
    },
    line: {
      fontFamily: BrandFonts.hand,
      fontSize: 24,
      lineHeight: 30,
      color: c.text,
    },
  });
