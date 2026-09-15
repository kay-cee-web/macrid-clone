/**
 * A tiny bus so non-React code (the axios interceptor) can tell the
 * AuthProvider the session died, and so stores can reset on logout.
 */
type AuthEvent = "unauthenticated" | "logout";
type Listener = () => void;

const listeners = new Map<AuthEvent, Set<Listener>>();

export function onAuthEvent(event: AuthEvent, listener: Listener) {
  const set = listeners.get(event) ?? new Set<Listener>();
  set.add(listener);
  listeners.set(event, set);
  return () => {
    set.delete(listener);
  };
}

export function emitAuthEvent(event: AuthEvent) {
  listeners.get(event)?.forEach((listener) => listener());
}
