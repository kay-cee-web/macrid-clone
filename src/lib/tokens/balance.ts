import { onAuthEvent } from "@/lib/auth/events";

/**
 * The account's token balance as of the last chat reply. There is no balance
 * endpoint; `tokens_remaining` on each reply is the only source, so this is
 * null until the first turn of the session.
 */
let balance: number | null = null;
const listeners = new Set<() => void>();

export const getTokenBalance = () => balance;
export const getServerTokenBalance = () => null;

export function subscribeTokenBalance(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setTokenBalance(next: number | null) {
  if (next === null || next === balance) return;
  balance = next;
  listeners.forEach((listener) => listener());
}

onAuthEvent("logout", () => {
  balance = null;
  listeners.forEach((listener) => listener());
});
