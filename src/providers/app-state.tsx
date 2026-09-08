/**
 * App-wide state shared across every surface. Loaded from AsyncStorage once on
 * mount, then written through on each change.
 *
 * - Onboarding prefs: pain points + voice (tone) + notify time.
 * - Account: a local mock sign-up/log-in created during onboarding — see
 *   `signUp`/`logIn` below. There's no backend, so this is one on-device
 *   account record, not a real authenticated session.
 * - Favorites: quotes kept from Today / Explore (the "saved" collection).
 * - Liked: quotes hearted on the Feed / Explore.
 * - Following: creator ids the user follows on the Feed.
 * - Wallpapers: recipes composed in Studio.
 * - Profile: username, avatar, and the bio quote (the user's favourite line).
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { MoodId } from '@/constants/library';
import { MOOD_TO_TONE } from '@/constants/library';
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
import { requestNotificationPermission, scheduleDailyQuote } from '@/lib/notifications';
import {
  clearOnboarding,
  loadAccount,
  loadFavorites,
  loadFollowing,
  loadLibraries,
  loadLiked,
  loadPrefs,
  loadProfile,
  loadReactions,
  loadWallpapers,
  saveAccount,
  saveFavorites,
  saveFollowing,
  saveLibraries,
  saveLiked,
  savePrefs,
  saveProfile,
  saveReactions,
  saveWallpapers,
  type OnboardingProfile,
} from '@/lib/storage';

/**
 * What onboarding v4 collects (see
 * src/components/onboarding/onboarding-flow.tsx): the moods derived from the
 * Interests step, the religious practice + age answers (v4-only, optional),
 * and the notify time. Tone is derived from `preferredMoods` via
 * MOOD_TO_TONE. `painPoints` is no longer collected in onboarding and is
 * always passed as `[]` — the type/param stays live in
 * quotable.ts/anthropic.ts. v4 has no dedicated notify-time picker screen
 * (cut along with the paywall/account steps, per the v4 redesign — see
 * onboarding-flow.tsx); `notifyTime` defaults to a sensible daily time.
 */
type OnboardingResult = {
  painPoints: PainPoint[];
  preferredMoods: MoodId[];
  notifyTime: NotifyTime;
  religiousPractice?: string;
  age?: number;
};

/** Result of a sign-up/log-in attempt on the onboarding account screen. */
type AuthResult = { ok: true } | { ok: false; error: string };

type AppState = {
  /** True until storage has been read — gate splash on this. */
  loading: boolean;
  onboarded: boolean;
  painPoints: PainPoint[];
  tone: Tone | null;
  notifyTime: NotifyTime | null;
  /** Onboarding v3's personalization answer. */
  onboardingProfile: OnboardingProfile;

  /** The local mock account, once one exists on this device. */
  account: Account | null;

  favorites: Quote[];
  liked: Quote[];
  following: string[];
  wallpapers: Wallpaper[];
  profile: Profile;

  completeOnboarding: (result: OnboardingResult) => Promise<void>;
  /** Dev-only: wipes onboarding state so the flow shows again immediately. */
  resetOnboarding: () => Promise<void>;

  /**
   * Local mock auth for the onboarding account screen — no backend, so this
   * creates/checks one on-device account record. `signUp` fails if an
   * account already exists (use `logIn` instead); `logIn` fails if no
   * account exists yet or the email/password don't match. Both set
   * `profile.username` to the account name on success.
   */
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  logIn: (email: string, password: string) => Promise<AuthResult>;

  toggleFavorite: (quote: Quote) => void;
  isSaved: (quote: Quote) => boolean;

  /** User-created "save to library" collections (Explore's Favorite button
   * opens a picker over these, Spotify-playlist-style) — separate from the
   * single `favorites` list above, which the picker also surfaces as its
   * pinned first option. */
  libraries: Library[];
  createLibrary: (name: string) => Library;
  addToLibrary: (libraryId: string, quote: Quote) => void;
  removeFromLibrary: (libraryId: string, quote: Quote) => void;
  isInLibrary: (libraryId: string, quote: Quote) => boolean;

  toggleLike: (quote: Quote) => void;
  isLiked: (quote: Quote) => boolean;

  /** Emoji reactions (long-press the like heart) — layered on top of the
   * plain like above, not a replacement. Multiple emoji per quote allowed. */
  toggleReaction: (quote: Quote, emoji: string) => void;
  reactionsFor: (quote: Quote) => string[];

  toggleFollow: (creatorId: string) => void;
  isFollowing: (creatorId: string) => boolean;

  addWallpaper: (wallpaper: Wallpaper) => void;
  removeWallpaper: (id: string) => void;

  updateProfile: (patch: Partial<Profile>) => void;
};

/**
 * NOT real security. There's no backend to check a password against, so this
 * is a deliberately simple, deterministic local-only transform — enough to
 * demo a sign-up/log-in flow's UX, never to protect anything real.
 */
function mockHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash * 31 + password.charCodeAt(i)) | 0;
  }
  return `mock_${hash}`;
}

const AppStateContext = createContext<AppState | null>(null);

/** Two quotes are "the same" if their text matches (ids are per-surfacing). */
function sameQuote(a: Quote, b: Quote): boolean {
  return a.text.trim() === b.text.trim();
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [tone, setTone] = useState<Tone | null>(null);
  const [notifyTime, setNotifyTime] = useState<NotifyTime | null>(null);
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfile>({
    preferredMoods: [],
  });
  const [account, setAccount] = useState<Account | null>(null);

  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [liked, setLiked] = useState<Quote[]>([]);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [reactions, setReactions] = useState<Record<string, string[]>>({});
  const [following, setFollowing] = useState<string[]>([]);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [profile, setProfile] = useState<Profile>({
    username: 'you',
    avatarUri: null,
    bioQuote: null,
  });

  useEffect(() => {
    (async () => {
      const [prefs, favs, likes, libs, reacts, follows, walls, prof, acct] = await Promise.all([
        loadPrefs(),
        loadFavorites(),
        loadLiked(),
        loadLibraries(),
        loadReactions(),
        loadFollowing(),
        loadWallpapers(),
        loadProfile(),
        loadAccount(),
      ]);
      setOnboarded(prefs.onboarded);
      setPainPoints(prefs.painPoints);
      setTone(prefs.tone);
      setNotifyTime(prefs.notifyTime);
      setOnboardingProfile(prefs.onboardingProfile);
      setFavorites(favs);
      setLiked(likes);
      setLibraries(libs);
      setReactions(reacts);
      setFollowing(follows);
      setWallpapers(walls);
      setProfile(prof);
      setAccount(acct);
      setLoading(false);
    })();
  }, []);

  async function completeOnboarding(result: OnboardingResult): Promise<void> {
    const tone = result.preferredMoods.length
      ? MOOD_TO_TONE[result.preferredMoods[0]]
      : 'warm';
    const profile: OnboardingProfile = {
      preferredMoods: result.preferredMoods,
      religiousPractice: result.religiousPractice,
      age: result.age,
    };
    setPainPoints(result.painPoints);
    setTone(tone);
    setNotifyTime(result.notifyTime);
    setOnboardingProfile(profile);
    setOnboarded(true);
    await savePrefs({
      painPoints: result.painPoints,
      tone,
      notifyTime: result.notifyTime,
      onboardingProfile: profile,
    });
    // Fires the native OS "Allow Notifications?" system dialog — there's no
    // custom in-app screen for this, iOS/Android own it. Was previously dead
    // code (requestNotificationPermission existed but nothing called it),
    // so the daily notification silently never fired. Asked right at
    // onboarding's end, immediately after the notification-preview screen
    // sold the feature — best-effort either way, scheduleDailyQuote already
    // swallows a denial safely.
    await requestNotificationPermission();
    await scheduleDailyQuote(result.notifyTime);
  }

  async function resetOnboarding(): Promise<void> {
    await clearOnboarding();
    setOnboarded(false);
    setPainPoints([]);
    setTone(null);
    setNotifyTime(null);
    setOnboardingProfile({ preferredMoods: [] });
  }

  async function signUp(name: string, email: string, password: string): Promise<AuthResult> {
    const cleanEmail = email.trim().toLowerCase();
    if (account) {
      return { ok: false, error: 'you already have an account on this device — log in instead' };
    }
    const next: Account = { name: name.trim(), email: cleanEmail, passwordHash: mockHash(password) };
    setAccount(next);
    await saveAccount(next);
    updateProfile({ username: next.name });
    return { ok: true };
  }

  async function logIn(email: string, password: string): Promise<AuthResult> {
    const cleanEmail = email.trim().toLowerCase();
    if (!account) {
      return { ok: false, error: 'no account found on this device — sign up first' };
    }
    if (account.email !== cleanEmail) {
      return { ok: false, error: 'no account found for that email' };
    }
    if (account.passwordHash !== mockHash(password)) {
      return { ok: false, error: 'that password doesn’t look right' };
    }
    updateProfile({ username: account.name });
    return { ok: true };
  }

  function toggleFavorite(quote: Quote): void {
    setFavorites((current) => {
      const exists = current.some((qq) => sameQuote(qq, quote));
      const next = exists
        ? current.filter((qq) => !sameQuote(qq, quote))
        : [quote, ...current];
      void saveFavorites(next);
      return next;
    });
  }

  function isSaved(quote: Quote): boolean {
    return favorites.some((qq) => sameQuote(qq, quote));
  }

  function createLibrary(name: string): Library {
    const clean = name.trim() || 'untitled';
    const next: Library = { id: `lib-${Date.now()}-${Math.round(Math.random() * 1e6)}`, name: clean, quotes: [] };
    setLibraries((current) => {
      const updated = [...current, next];
      void saveLibraries(updated);
      return updated;
    });
    return next;
  }

  function addToLibrary(libraryId: string, quote: Quote): void {
    setLibraries((current) => {
      const updated = current.map((lib) =>
        lib.id === libraryId && !lib.quotes.some((qq) => sameQuote(qq, quote))
          ? { ...lib, quotes: [quote, ...lib.quotes] }
          : lib,
      );
      void saveLibraries(updated);
      return updated;
    });
  }

  function removeFromLibrary(libraryId: string, quote: Quote): void {
    setLibraries((current) => {
      const updated = current.map((lib) =>
        lib.id === libraryId
          ? { ...lib, quotes: lib.quotes.filter((qq) => !sameQuote(qq, quote)) }
          : lib,
      );
      void saveLibraries(updated);
      return updated;
    });
  }

  function isInLibrary(libraryId: string, quote: Quote): boolean {
    return libraries.find((lib) => lib.id === libraryId)?.quotes.some((qq) => sameQuote(qq, quote)) ?? false;
  }

  function toggleLike(quote: Quote): void {
    setLiked((current) => {
      const exists = current.some((qq) => sameQuote(qq, quote));
      const next = exists
        ? current.filter((qq) => !sameQuote(qq, quote))
        : [quote, ...current];
      void saveLiked(next);
      return next;
    });
  }

  function isLiked(quote: Quote): boolean {
    return liked.some((qq) => sameQuote(qq, quote));
  }

  /** Keyed by trimmed quote text, matching `sameQuote`'s own notion of "the
   * same quote" — reactions don't care which surfacing/id it came from. */
  function reactionKey(quote: Quote): string {
    return quote.text.trim();
  }

  function toggleReaction(quote: Quote, emoji: string): void {
    setReactions((current) => {
      const key = reactionKey(quote);
      const existing = current[key] ?? [];
      const nextForQuote = existing.includes(emoji)
        ? existing.filter((e) => e !== emoji)
        : [...existing, emoji];
      const next =
        nextForQuote.length > 0
          ? { ...current, [key]: nextForQuote }
          : Object.fromEntries(Object.entries(current).filter(([k]) => k !== key));
      void saveReactions(next);
      return next;
    });
  }

  function reactionsFor(quote: Quote): string[] {
    return reactions[reactionKey(quote)] ?? [];
  }

  function toggleFollow(creatorId: string): void {
    setFollowing((current) => {
      const next = current.includes(creatorId)
        ? current.filter((id) => id !== creatorId)
        : [...current, creatorId];
      void saveFollowing(next);
      return next;
    });
  }

  function isFollowing(creatorId: string): boolean {
    return following.includes(creatorId);
  }

  function addWallpaper(wallpaper: Wallpaper): void {
    setWallpapers((current) => {
      const next = [wallpaper, ...current];
      void saveWallpapers(next);
      return next;
    });
  }

  function removeWallpaper(id: string): void {
    setWallpapers((current) => {
      const next = current.filter((w) => w.id !== id);
      void saveWallpapers(next);
      return next;
    });
  }

  function updateProfile(patch: Partial<Profile>): void {
    setProfile((current) => {
      const next = { ...current, ...patch };
      void saveProfile(next);
      return next;
    });
  }

  return (
    <AppStateContext.Provider
      value={{
        loading,
        onboarded,
        painPoints,
        tone,
        notifyTime,
        onboardingProfile,
        account,
        favorites,
        liked,
        libraries,
        following,
        wallpapers,
        profile,
        completeOnboarding,
        resetOnboarding,
        signUp,
        logIn,
        toggleFavorite,
        isSaved,
        createLibrary,
        addToLibrary,
        removeFromLibrary,
        isInLibrary,
        toggleLike,
        isLiked,
        toggleReaction,
        reactionsFor,
        toggleFollow,
        isFollowing,
        addWallpaper,
        removeWallpaper,
        updateProfile,
      }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return ctx;
}
