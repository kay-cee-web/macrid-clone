import type { Agent } from "@/types/agent";

/**
 * Which agent you last gave work to, kept in this browser.
 *
 * The backend can't answer this. `agents.updated_at` moves when an agent is
 * *changed* — renamed, re-instructed, switched model — and a chat turn leaves it
 * alone (confirmed 2026-10-02: Ridge 3's newest message is today, its row still
 * reads the day it was created). Ordering by it gives the newest agent, not the
 * one in use, so anything that claims "last used" has to record it here.
 *
 * Written as an external store so `useSyncExternalStore` can read it without an
 * effect. It is per browser: a fresh device knows nothing, which is why the one
 * screen that depends on it also lets you choose.
 */
const KEY = "agentLastUsed";

type Uses = Readonly<Record<string, number>>;

let snapshot: Uses | null = null;
const listeners = new Set<() => void>();
const EMPTY: Uses = {};

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

/** Cached, so `useSyncExternalStore` sees a stable value between writes. */
export function readAgentUses(): Uses {
  if (snapshot) return snapshot;
  try {
    const saved: unknown = JSON.parse(storage()?.getItem(KEY) ?? "{}");
    snapshot = saved && typeof saved === "object" ? (saved as Uses) : {};
  } catch {
    snapshot = {};
  }
  return snapshot;
}

/** Nothing known on the server, so the markup matches before the store is read. */
export const serverAgentUses = (): Uses => EMPTY;

export function subscribeToAgentUses(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function recordAgentUse(id: string) {
  if (!id) return;
  const next = { ...readAgentUses(), [id]: Date.now() };
  snapshot = next;
  try {
    storage()?.setItem(KEY, JSON.stringify(next));
  } catch {
    // A full or blocked store only costs the memory of this choice.
  }
  listeners.forEach((listener) => listener());
}

/**
 * The agent to hand work to: the one last used in this browser, or — with
 * nothing recorded yet — the newest, which is all the account can tell us.
 */
export function preferredAgent(agents: Agent[], uses: Uses): Agent | null {
  const used = agents.filter((agent) => uses[agent.id]);
  if (!used.length) return agents[0] ?? null;
  return used.reduce((best, agent) => (uses[agent.id] > uses[best.id] ? agent : best));
}
