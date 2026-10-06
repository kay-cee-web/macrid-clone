const TOKEN_KEY = "token";
const REDIRECT_KEY = "redirectAfterLogin";

/** Routes a user should never be sent back to after signing in. */
const AUTH_PATHS = ["/login", "/register", "/logout", "/email-verify", "/forgot-password"];

export const DEFAULT_AFTER_LOGIN = "/";

function safeStorage(kind: "local" | "session" = "local"): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

/** A remembered token lives in localStorage; otherwise sessionStorage, which the browser drops on close. */
export const getToken = () =>
  safeStorage()?.getItem(TOKEN_KEY) ?? safeStorage("session")?.getItem(TOKEN_KEY) ?? null;

export function setToken(token: string, remember = true) {
  safeStorage(remember ? "session" : "local")?.removeItem(TOKEN_KEY);
  safeStorage(remember ? "local" : "session")?.setItem(TOKEN_KEY, token);
}

export function clearSession() {
  const storage = safeStorage();
  storage?.removeItem(TOKEN_KEY);
  storage?.removeItem(REDIRECT_KEY);
  safeStorage("session")?.removeItem(TOKEN_KEY);
}

export function rememberRedirect(path: string) {
  if (AUTH_PATHS.some((p) => path.startsWith(p))) return;
  safeStorage()?.setItem(REDIRECT_KEY, path);
}

/** Reads and forgets the saved path, so it is used exactly once. */
export function takeRedirect(): string {
  const storage = safeStorage();
  const path = storage?.getItem(REDIRECT_KEY);
  storage?.removeItem(REDIRECT_KEY);
  return path || DEFAULT_AFTER_LOGIN;
}

/** Backend returns the token under different keys depending on the route. */
export function readToken(data: unknown): string {
  const d = data as { token?: string; access_token?: string; data?: { token?: string } };
  return d?.token || d?.access_token || d?.data?.token || "";
}
