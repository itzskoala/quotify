/**
 * A one-slot hand-off used to send a quote from Explore / Profile into the
 * Studio tab. Studio consumes the pending quote when it next renders, then
 * clears it. Kept as a tiny external store (no context wiring across tabs).
 */
import { useSyncExternalStore } from 'react';

import type { Quote } from '@/constants/quotable';

let pending: Quote | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

/** Queue a quote for Studio. The caller navigates to the Studio tab. */
export function sendToStudio(quote: Quote): void {
  pending = quote;
  emit();
}

export function clearPendingStudioQuote(): void {
  if (pending !== null) {
    pending = null;
    emit();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Reactively read the quote waiting for Studio (or null). */
export function usePendingStudioQuote(): Quote | null {
  return useSyncExternalStore(
    subscribe,
    () => pending,
    () => pending,
  );
}
