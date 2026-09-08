/**
 * Me/profile is no longer a tab (see app-tabs.tsx) — it's a full-screen
 * overlay opened from an avatar button on Home/Explore, following the same
 * "detail views are overlays, not routes" pattern as StoryOverlay. This is a
 * one-slot external store for the open/closed flag, mirrored on
 * `quote-bus.ts`'s pattern (no context wiring needed for a single boolean).
 */
import { useSyncExternalStore } from 'react';

let open = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function openProfile(): void {
  if (!open) {
    open = true;
    emit();
  }
}

export function closeProfile(): void {
  if (open) {
    open = false;
    emit();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Reactively read whether the profile overlay should be shown. */
export function useProfileOpen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => open,
  );
}
