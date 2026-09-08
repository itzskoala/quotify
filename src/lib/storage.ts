/**
 * Persistence for onboarding prefs and saved quotes (AsyncStorage).
 * All functions are safe no-ops on read failure so the UI never crashes.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  Account,
  Library,
  NotifyTime,
  PainPoint,
  Profile,
  Quote,
  Tone,
  Wallpaper,
} from '@/constants/quotable';
import type { MoodId } from '@/constants/library';

const KEYS = {
  onboarded: 'quotable.onboarded',
  pain: 'quotable.painPoints',
  tone: 'quotable.tone',
  notifyTime: 'quotable.notifyTime',
  // Onboarding's personalization answers — see
  // src/components/onboarding/onboarding-flow.tsx.
  onboardingProfile: 'quotable.onboardingProfile',
  favorites: 'quotable.favorites',
  liked: 'quotable.liked',
  reactions: 'quotable.reactions',
  libraries: 'quotable.libraries',
  following: 'quotable.following',
  wallpapers: 'quotable.wallpapers',
  profile: 'quotable.profile',
  account: 'quotable.account',
} as const;

/** Onboarding's personalization answers — see src/components/onboarding/. */
export type OnboardingProfile = {
  preferredMoods: MoodId[];
  /** Set only if "Religion" was picked on the Interests step (v4+). */
  religiousPractice?: string;
  /** From the v4 age slider; 76 means "75+". */
  age?: number;
};

const EMPTY_ONBOARDING_PROFILE: OnboardingProfile = {
  preferredMoods: [],
};

export type Prefs = {
  onboarded: boolean;
  painPoints: PainPoint[];
  tone: Tone | null;
  notifyTime: NotifyTime | null;
  onboardingProfile: OnboardingProfile;
};

export async function loadPrefs(): Promise<Prefs> {
  try {
    const [onboarded, pain, tone, notifyTimeRaw, onboardingProfileRaw] = await Promise.all([
      AsyncStorage.getItem(KEYS.onboarded),
      AsyncStorage.getItem(KEYS.pain),
      AsyncStorage.getItem(KEYS.tone),
      AsyncStorage.getItem(KEYS.notifyTime),
      AsyncStorage.getItem(KEYS.onboardingProfile),
    ]);
    return {
      onboarded: onboarded === 'true',
      painPoints: pain ? (JSON.parse(pain) as PainPoint[]) : [],
      tone: (tone as Tone | null) ?? null,
      notifyTime: notifyTimeRaw ? (JSON.parse(notifyTimeRaw) as NotifyTime) : null,
      onboardingProfile: onboardingProfileRaw
        ? (JSON.parse(onboardingProfileRaw) as OnboardingProfile)
        : EMPTY_ONBOARDING_PROFILE,
    };
  } catch {
    return {
      onboarded: false,
      painPoints: [],
      tone: null,
      notifyTime: null,
      onboardingProfile: EMPTY_ONBOARDING_PROFILE,
    };
  }
}

export async function savePrefs(prefs: {
  painPoints: PainPoint[];
  tone: Tone;
  notifyTime: NotifyTime;
  onboardingProfile: OnboardingProfile;
}): Promise<void> {
  try {
    await AsyncStorage.multiSet([
      [KEYS.onboarded, 'true'],
      [KEYS.pain, JSON.stringify(prefs.painPoints)],
      [KEYS.tone, prefs.tone],
      [KEYS.notifyTime, JSON.stringify(prefs.notifyTime)],
      [KEYS.onboardingProfile, JSON.stringify(prefs.onboardingProfile)],
    ]);
  } catch {
    // best-effort
  }
}

/** Dev-only: wipes onboarding state so the app shows the flow again. Does
 * not touch favorites/liked/following/wallpapers/profile/account — signing
 * back in during onboarding should find the same local account. */
export async function clearOnboarding(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      KEYS.onboarded,
      KEYS.pain,
      KEYS.tone,
      KEYS.notifyTime,
      KEYS.onboardingProfile,
    ]);
  } catch {
    // best-effort
  }
}

/**
 * The local mock account created/logged into during onboarding (see
 * src/components/onboarding/account.tsx). There is no backend — this is a
 * single account record kept on-device, not a real authenticated session.
 */
export async function loadAccount(): Promise<Account | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.account);
    return raw ? (JSON.parse(raw) as Account) : null;
  } catch {
    return null;
  }
}

export async function saveAccount(account: Account): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.account, JSON.stringify(account));
  } catch {
    // best-effort
  }
}

export async function loadFavorites(): Promise<Quote[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.favorites);
    return raw ? (JSON.parse(raw) as Quote[]) : [];
  } catch {
    return [];
  }
}

export async function saveFavorites(favorites: Quote[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.favorites, JSON.stringify(favorites));
  } catch {
    // best-effort
  }
}

/** Generic JSON array loader (liked quotes, following ids, wallpapers). */
async function loadJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function saveJson(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // best-effort
  }
}

export const loadLiked = () => loadJson<Quote[]>(KEYS.liked, []);
export const saveLiked = (liked: Quote[]) => saveJson(KEYS.liked, liked);

/** Emoji reactions on a quote — like/love/etc are all the same mechanism,
 * keyed by quote text (see `sameQuote` in app-state.tsx), value is the set
 * of emoji the user has reacted with. Layered on top of the plain
 * like/heart toggle above, not a replacement for it. */
export const loadReactions = () => loadJson<Record<string, string[]>>(KEYS.reactions, {});
export const saveReactions = (r: Record<string, string[]>) => saveJson(KEYS.reactions, r);

export const loadLibraries = () => loadJson<Library[]>(KEYS.libraries, []);
export const saveLibraries = (libs: Library[]) => saveJson(KEYS.libraries, libs);

export const loadFollowing = () => loadJson<string[]>(KEYS.following, []);
export const saveFollowing = (ids: string[]) => saveJson(KEYS.following, ids);

export const loadWallpapers = () => loadJson<Wallpaper[]>(KEYS.wallpapers, []);
export const saveWallpapers = (w: Wallpaper[]) => saveJson(KEYS.wallpapers, w);

const DEFAULT_PROFILE: Profile = {
  username: 'you',
  avatarUri: null,
  bioQuote: null,
};

export const loadProfile = () => loadJson<Profile>(KEYS.profile, DEFAULT_PROFILE);
export const saveProfile = (p: Profile) => saveJson(KEYS.profile, p);
