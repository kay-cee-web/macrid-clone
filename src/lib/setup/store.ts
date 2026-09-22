import { onAuthEvent } from "@/lib/auth/events";
import { fetchConnections } from "@/services/connections";
import type { Connections } from "@/types/connector";
import { setupFrom, type WorkspaceSetup } from "./platforms";

/**
 * Workspace connections, read once and shared by idea cards and the chat check:
 * the raw `connections` (record ids, for disconnecting) and the `setup` derived
 * from them. Kept for a few minutes; Plugins primes it with every fresh read,
 * and a connect or disconnect anywhere calls `refreshSetup`.
 */
const MAX_AGE_MS = 5 * 60_000;

let connections: Connections | null = null;
let setup: WorkspaceSetup | null = null;
let loadedAt = 0;
let inflight: Promise<void> | null = null;
let generation = 0;
/** Only the newest read lands, so a slow cached read can't undo a refresh. */
let latest = 0;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

function apply(next: Connections) {
  connections = next;
  setup = setupFrom(next);
  loadedAt = Date.now();
  emit();
}

export const getSetup = () => setup;
export const getConnections = () => connections;
export const getServerSnapshot = () => null;

export function subscribeSetup(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function read(): Promise<void> {
  const from = generation;
  const ticket = ++latest;
  return fetchConnections()
    .then((next) => {
      if (from === generation && ticket === latest) apply(next);
    })
    .catch(() => {});
}

/** A failed read leaves setup null, which never blocks anything. */
export function loadSetup(): Promise<void> {
  if (inflight) return inflight;
  if (setup && Date.now() - loadedAt < MAX_AGE_MS) return Promise.resolve();
  inflight = read().finally(() => {
    inflight = null;
  });
  return inflight;
}

/** After a connect or disconnect: read again now, whatever the cache says. */
export const refreshSetup = () => read();

/** Plugins already holds fresh connections after a change: use them instead of reading again. */
export function primeSetup(next: Connections) {
  latest += 1;
  apply(next);
}

onAuthEvent("logout", () => {
  generation += 1;
  connections = null;
  setup = null;
  loadedAt = 0;
  emit();
});
