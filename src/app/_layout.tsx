import { IndieFlower_400Regular } from '@expo-google-fonts/indie-flower';
import { Inter_400Regular, Inter_500Medium, useFonts } from '@expo-google-fonts/inter';
import {
  Urbanist_400Regular,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from '@expo-google-fonts/urbanist';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, View } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { useBrand } from '@/hooks/use-brand';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppStateProvider, useAppState } from '@/providers/app-state';

SplashScreen.preventAutoHideAsync();

/**
 * Keeps the tab navigator mounted at all times (so Expo Router always has a
 * navigator for the current route) and lays onboarding over it as a full-screen
 * overlay until the user has completed it.
 */
function RootContent({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { loading, onboarded } = useAppState();
  const c = useBrand();

  // Hold on a themed frame while fonts / stored prefs resolve. The animated
  // splash overlay sits on top and covers this initial frame.
  if (!fontsLoaded || loading) {
    return <View style={{ flex: 1, backgroundColor: c.bg }} />;
  }

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      <AppTabs />
      {!onboarded && (
        <View style={StyleSheet.absoluteFill}>
          <OnboardingFlow />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default function RootLayout() {
  const scheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    IndieFlower_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Urbanist_400Regular,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
  });

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppStateProvider>
        <AnimatedSplashOverlay />
        <RootContent fontsLoaded={fontsLoaded} />
      </AppStateProvider>
    </ThemeProvider>
  );
}
