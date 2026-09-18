/**
 * Which collapsible sidebar sections are open, kept in this browser. Written as
 * an external store so `useSyncExternalStore` can read it without an effect,
 * and so every copy of a section agrees.
 */
const KEY = "openSections";

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
export function readOpenSections(): ReadonlySet<string> {
  if (snapshot) return snapshot;
  try {
    const saved: unknown = JSON.parse(storage()?.getItem(KEY) ?? "[]");
    snapshot = new Set(Array.isArray(saved) ? saved.filter((key): key is string => typeof key === "string") : []);
  } catch {
    snapshot = new Set();
  }
  return snapshot;
}

/** Closed on the server, so the markup matches before the store is read. */
export const serverOpenSections = (): ReadonlySet<string> => EMPTY;

export function subscribeToSections(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function toggleSection(key: string): boolean {
  const next = new Set(readOpenSections());
  const open = !next.delete(key);
  if (open) next.add(key);

  snapshot = next;
  try {
    storage()?.setItem(KEY, JSON.stringify([...next]));
  } catch {
    // A full or blocked store only costs the memory of this choice.
  }
  listeners.forEach((listener) => listener());
  return open;
}
