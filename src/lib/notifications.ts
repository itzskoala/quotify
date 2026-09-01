/**
 * Daily-quote notifications — the retention hook. Schedules one repeating
 * local notification at the user's chosen time-of-day preset so they're drawn
 * back to a fresh quote each day. Native-only; no-ops on web.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { NotifyTime } from '@/constants/quotable';

// Show the banner even when the app is foregrounded. (Native only — the web
// build has no notification handler to register.)
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

const BODIES = [
  'A quote is waiting for you 🕊️',
  'Take a breath — here is your line for today.',
  'Something to hear, right now.',
];

/** Ask for permission. Returns true if granted. */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted) return true;
    const req = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });
    return req.granted;
  } catch {
    return false;
  }
}

/**
 * Replace any existing daily quote notification with one at the given time
 * (chosen via the onboarding wheel picker — see wheel-time-picker.tsx).
 * Safe to call repeatedly (cancels the prior schedule first).
 */
export async function scheduleDailyQuote({ hour, minute }: NotifyTime): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Quotable',
        body: BODIES[Math.floor(Math.random() * BODIES.length)],
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch {
    // best-effort — a failed schedule shouldn't block onboarding
  }
}
