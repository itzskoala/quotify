/**
 * Today — the core surface. A time-aware greeting and a live, personalized
 * quote (tuned to the user's pain points + preferred voice). The "connect"
 * loop lives here: save it, share it, or ask for another.
 */
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Share, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaperCard } from '@/components/paper-card';
import { SquishyButton } from '@/components/squishy-button';
import { ThemedText } from '@/components/themed-text';
import { greeting, timeOfDay, type Quote } from '@/constants/quotable';
import { BottomTabInset, BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import { generateQuote } from '@/lib/anthropic';
import * as haptics from '@/lib/haptics';
import * as sound from '@/lib/sound';
import { useAppState } from '@/providers/app-state';

export default function TodayScreen() {
  const { onboarded, painPoints, tone, toggleFavorite, isSaved } = useAppState();
  const c = useBrand();
  const s = styles(c);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh(announce: boolean) {
    setLoading(true);
    const next = await generateQuote({
      painPoints,
      tone: tone ?? 'warm',
      timeOfDay: timeOfDay(),
    });
    setQuote(next);
    setLoading(false);
    if (announce) {
      haptics.soft();
      sound.chime();
    }
  }

  // Fetch once onboarded (avoids a wasted fetch behind the onboarding overlay,
  // and never gets stuck if older stored prefs lack a tone).
  useEffect(() => {
    if (!onboarded) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboarded]);

  function handleSave() {
    if (!quote) return;
    haptics.success();
    toggleFavorite(quote);
  }

  async function handleShare() {
    if (!quote) return;
    const authorLine = quote.author ? ` — ${quote.author}` : '';
    await Share.share({ message: `${quote.text}${authorLine}\n\nvia Quotable` });
  }

  const saved = quote ? isSaved(quote) : false;

  return (
    <View style={s.screen}>
      <SafeAreaView style={s.safe}>
        <View style={s.header}>
          <ThemedText style={s.greeting}>{greeting()}</ThemedText>
        </View>

        <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
          {loading || !quote ? (
            <View style={s.loading}>
              <ActivityIndicator color={c.accent} />
              <ThemedText style={s.loadingText}>finding your words</ThemedText>
            </View>
          ) : (
            <PaperCard quote={quote} />
          )}
        </ScrollView>

        <View style={s.actions}>
          <SquishyButton
            label={saved ? 'saved' : 'save'}
            variant={saved ? 'ghost' : 'primary'}
            onPress={handleSave}
            disabled={!quote}
            style={s.action}
          />
          <SquishyButton
            label="share"
            variant="ghost"
            onPress={handleShare}
            disabled={!quote}
            style={s.action}
          />
          <SquishyButton
            label="another"
            variant="ghost"
            onPress={() => void refresh(true)}
            disabled={loading}
            style={s.action}
          />
        </View>
      </SafeAreaView>
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
      paddingHorizontal: Spacing.four,
    },
    header: {
      alignItems: 'center',
      paddingTop: Spacing.five,
    },
    greeting: {
      fontFamily: BrandFonts.sans,
      fontSize: 14,
      letterSpacing: 0.6,
      color: c.textDim,
    },
    body: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingVertical: Spacing.five,
    },
    loading: {
      alignItems: 'center',
      gap: Spacing.three,
    },
    loadingText: {
      fontFamily: BrandFonts.sans,
      fontSize: 14,
      color: c.textDim,
      letterSpacing: 0.3,
    },
    actions: {
      flexDirection: 'row',
      gap: Spacing.two,
      paddingBottom: BottomTabInset + Spacing.three,
    },
    action: {
      flex: 1,
    },
  });
