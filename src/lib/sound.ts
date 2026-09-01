/**
 * ASMR sound hooks. Ships with SILENT placeholder WAVs so the app is runnable
 * today — drop real audio into `assets/sounds/chime.wav` and `squish.wav`
 * (keep the filenames) and it comes alive with no code change.
 *
 * Players are created lazily and everything is wrapped so a missing/failed
 * audio engine (e.g. web, or a bad file) never breaks an interaction.
 */
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { Platform } from 'react-native';

const SOURCES = {
  chime: require('@/assets/sounds/chime.wav'),
  squish: require('@/assets/sounds/squish.wav'),
} as const;

type SoundName = keyof typeof SOURCES;

const players: Partial<Record<SoundName, AudioPlayer>> = {};
let audioModeReady = false;

async function ensureAudioMode(): Promise<void> {
  if (audioModeReady || Platform.OS === 'web') return;
  audioModeReady = true;
  try {
    await setAudioModeAsync({ playsInSilentMode: true });
  } catch {
    // non-fatal
  }
}

function playerFor(name: SoundName): AudioPlayer | null {
  if (Platform.OS === 'web') return null;
  if (!players[name]) {
    try {
      players[name] = createAudioPlayer(SOURCES[name]);
    } catch {
      return null;
    }
  }
  return players[name] ?? null;
}

function play(name: SoundName): void {
  void ensureAudioMode();
  const player = playerFor(name);
  if (!player) return;
  try {
    player.seekTo(0);
    player.play();
  } catch {
    // non-fatal
  }
}

/** Sweet chime — quote arrivals, completing onboarding. */
export function chime(): void {
  play('chime');
}

/** Creamy squish — button presses. */
export function squish(): void {
  play('squish');
}
