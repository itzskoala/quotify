/**
 * Thin haptics wrappers. Native-only; no-ops on web. Failures are swallowed
 * so a missing haptic engine never breaks an interaction.
 */
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** A soft tap for presses (buttons, selections). */
export function tap(): void {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** A satisfying double-thump for saving / completing. */
export function success(): void {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
    () => {},
  );
}

/** A gentle bump for a new quote arriving. */
export function soft(): void {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft).catch(() => {});
}
