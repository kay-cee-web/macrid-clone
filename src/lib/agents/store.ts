import { extractApiError } from "@/lib/api/errors";
import { onAuthEvent } from "@/lib/auth/events";
import { sortAgents } from "@/lib/agents/sort";
import { fetchAgents } from "@/services/agents";
import type { Agent } from "@/types/agent";

/**
 * One agents store shared by the sidebar, the catalog and every workspace.
 * Read it through useAgents(); change it through ./actions.
 */
export type AgentsState = {
  agents: Agent[];
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
};

const INITIAL: AgentsState = { agents: [], status: "idle", error: null };

let state: AgentsState = INITIAL;
let inflight: Promise<void> | null = null;
/** Bumped on reset so a response for a previous user is thrown away. */
let generation = 0;
const listeners = new Set<() => void>();

export const getAgentsState = () => state;
export const getServerAgentsState = () => INITIAL;

export function subscribeAgents(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setAgentsState(update: (current: AgentsState) => AgentsState) {
  state = update(state);
  listeners.forEach((listener) => listener());
}

/** Replace or insert rows, keeping "recently edited" order. */
export function setAgents(update: (agents: Agent[]) => Agent[]) {
  setAgentsState((s) => ({ ...s, agents: sortAgents(update(s.agents)) }));
}

/** Loads once; later calls reuse the result unless `force` is set. */
export function loadAgents({ force = false } = {}): Promise<void> {
  if (inflight) return inflight;
  if (!force && state.status === "ready") return Promise.resolve();

  const run = generation;
  setAgentsState((s) => ({ ...s, status: "loading", error: null }));

  inflight = fetchAgents()
    .then((agents) => {
      if (run !== generation) return;
      setAgentsState(() => ({ agents: sortAgents(agents), status: "ready", error: null }));
    })
    .catch((err) => {
      if (run !== generation) return;
      setAgentsState((s) => ({ ...s, status: "error", error: extractApiError(err, "Could not load your agents") }));
    })
    .finally(() => {
      if (run === generation) inflight = null;
    });
  return inflight;
}

/** Forget everything, so the next user never sees this user's agents. */
export function resetAgents() {
  generation += 1;
  inflight = null;
  setAgentsState(() => INITIAL);
}

onAuthEvent("logout", resetAgents);
