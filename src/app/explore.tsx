/**
 * Explore — the Mood Board. A library of quotes organised by mood (motivation,
 * workout, romance, anime, movies, calm, wisdom). Pick a board, then like, save,
 * turn a line into a wallpaper, or read the story behind its author.
 *
 * (Route file kept as `explore` to match the tab config.)
 */
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MoodArt } from '@/components/mood-art';
import { PaperCard } from '@/components/paper-card';
import { QuoteActions } from '@/components/quote-actions';
import { StoryOverlay } from '@/components/story-overlay';
import { ThemedText } from '@/components/themed-text';
import { MOODS, quotesForMood, storyFor, type MoodId, type Story } from '@/constants/library';
import { BottomTabInset, BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';

export default function ExploreScreen() {
  const c = useBrand();
  const s = styles(c);
  const [mood, setMood] = useState<MoodId | null>(null);
  const [story, setStory] = useState<Story | null>(null);

  const activeMood = MOODS.find((m) => m.id === mood) ?? null;

  return (
    <View style={s.screen}>
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.header}>
          <ThemedText style={s.kicker}>mood board</ThemedText>
          <ThemedText style={s.title}>{activeMood ? activeMood.label.toLowerCase() : 'explore'}</ThemedText>
          {activeMood ? (
            <Pressable
              onPress={() => {
                haptics.tap();
                setMood(null);
              }}
              hitSlop={10}>
              <ThemedText style={s.back}>← all moods</ThemedText>
            </Pressable>
          ) : (
            <ThemedText style={s.sub}>pick a feeling. find the words.</ThemedText>
          )}
        </View>

        {activeMood ? (
          <ScrollView
            contentContainerStyle={s.list}
            showsVerticalScrollIndicator={false}
            key={activeMood.id}>
            {quotesForMood(activeMood.id).map((q) => {
              const st = q.hasStory ? storyFor(q.author) : undefined;
              return (
                <View key={q.id} style={s.item}>
                  <PaperCard quote={q} compact />
                  <QuoteActions quote={q} onStory={st ? () => setStory(st) : undefined} />
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={s.grid}
            showsVerticalScrollIndicator={false}>
            {MOODS.map((m) => (
              <Pressable
                key={m.id}
                onPress={() => {
                  haptics.soft();
                  setMood(m.id);
                }}
                style={({ pressed }) => [s.tile, pressed && s.pressed]}>
                <LinearGradient colors={[c.raised, c.raisedActive]} style={StyleSheet.absoluteFill} />
                <View style={s.art}>
                  <MoodArt mood={m.id} />
                </View>
                <LinearGradient
                  colors={['transparent', c.raised]}
                  style={s.tileScrim}
                  pointerEvents="none"
                />
                <View style={s.tileLabelWrap}>
                  <ThemedText style={s.tileLabel}>{m.label}</ThemedText>
                  <ThemedText style={s.tileBlurb}>{m.blurb}</ThemedText>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>

      {story ? <StoryOverlay story={story} onClose={() => setStory(null)} /> : null}
    </View>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.bg,
    },
    safe: {
      flex: 1,
    },
    header: {
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.four,
      gap: Spacing.half,
    },
    kicker: {
      fontFamily: BrandFonts.sans,
      fontSize: 12,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: c.textFaint,
    },
    title: {
      fontFamily: BrandFonts.hand,
      fontSize: 44,
      lineHeight: 50,
      color: c.text,
    },
    sub: {
      fontFamily: BrandFonts.hand,
      fontSize: 20,
      color: c.textDim,
    },
    back: {
      fontFamily: BrandFonts.sansMedium,
      fontSize: 13,
      color: c.textDim,
      marginTop: Spacing.one,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.four,
      paddingBottom: BottomTabInset + Spacing.six,
      gap: Spacing.three,
    },
    tile: {
      width: '47%',
      aspectRatio: 0.82,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: c.line,
      overflow: 'hidden',
      justifyContent: 'flex-end',
    },
    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
    art: {
      position: 'absolute',
      top: '8%',
      left: '10%',
      right: '10%',
      bottom: '26%',
    },
    tileScrim: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '55%',
    },
    tileLabelWrap: {
      padding: Spacing.three,
      gap: Spacing.half,
    },
    tileLabel: {
      fontFamily: BrandFonts.hand,
      fontSize: 28,
      lineHeight: 30,
      color: c.text,
    },
    tileBlurb: {
      fontFamily: BrandFonts.sans,
      fontSize: 12,
      color: c.textDim,
    },
    list: {
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.four,
      paddingBottom: BottomTabInset + Spacing.six,
      gap: Spacing.five,
    },
    item: {
      gap: Spacing.three,
    },
  });
