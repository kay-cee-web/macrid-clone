import { onAuthEvent } from "@/lib/auth/events";
import { fetchConnections } from "@/services/connections";
import type { Connections } from "@/types/connector";
import { setupFrom, type WorkspaceSetup } from "./platforms";

/**
 * Workspace setup, read once and shared by idea cards and the chat check.
 * Kept for a few minutes; Plugins primes it with every fresh read.
 */
const MAX_AGE_MS = 5 * 60_000;

let setup: WorkspaceSetup | null = null;
let loadedAt = 0;
let inflight: Promise<void> | null = null;
let generation = 0;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

export const getSetup = () => setup;
export const getServerSetup = () => null;

export function subscribeSetup(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** A failed read leaves setup null, which never blocks anything. */
export function loadSetup(): Promise<void> {
  if (inflight) return inflight;
  if (setup && Date.now() - loadedAt < MAX_AGE_MS) return Promise.resolve();
  const from = generation;
  inflight = fetchConnections()
    .then((connections) => {
      if (from !== generation) return;
      setup = setupFrom(connections);
      loadedAt = Date.now();
      emit();
    })
    .catch(() => {})
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** Plugins already holds fresh connections after a change: use them instead of reading again. */
export function primeSetup(connections: Connections) {
  setup = setupFrom(connections);
  loadedAt = Date.now();
  emit();
}

onAuthEvent("logout", () => {
  generation += 1;
  setup = null;
  loadedAt = 0;
  emit();
});
