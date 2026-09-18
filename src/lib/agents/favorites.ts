/**
 * Favourite agents, kept in this browser.
 *
 * The backend has no `favorite` column — `PUT {favorite: true}` answers 200 and
 * throws the value away — so there is nowhere to store this yet. Ids are unique
 * per agent, so another account signing in on the same browser can never see
 * its own agents starred by these ids.
 */
const KEY = "favoriteAgents";

let snapshot: ReadonlySet<string> | null = null;
const listeners = new Set<() => void>();
const EMPTY: ReadonlySet<string> = new Set();

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

/** Cached, so `useSyncExternalStore` sees a stable value between writes. */
export function readFavorites(): ReadonlySet<string> {
  if (snapshot) return snapshot;
  try {
    const saved: unknown = JSON.parse(storage()?.getItem(KEY) ?? "[]");
    snapshot = new Set(Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string") : []);
  } catch {
    snapshot = new Set();
  }
  return snapshot;
}

export const serverFavorites = (): ReadonlySet<string> => EMPTY;

export function subscribeToFavorites(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function toggleFavorite(id: string): boolean {
  const next = new Set(readFavorites());
  const favorited = !next.delete(id);
  if (favorited) next.add(id);

  snapshot = next;
  try {
    storage()?.setItem(KEY, JSON.stringify([...next]));
  } catch {
    // A full or blocked store only costs the memory of this choice.
  }
  listeners.forEach((listener) => listener());
  return favorited;
}
