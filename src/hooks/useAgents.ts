"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getAgentsState, getServerAgentsState, loadAgents, subscribeAgents } from "@/lib/agents/store";

/** The shared agents list; loads it on first use. */
export function useAgents() {
  const state = useSyncExternalStore(subscribeAgents, getAgentsState, getServerAgentsState);

  useEffect(() => {
    void loadAgents();
  }, []);

  return { ...state, reload: () => loadAgents({ force: true }) };
}

/** One agent from the shared list, by id. */
export function useAgent(id: string) {
  const { agents, status, error, reload } = useAgents();
  const agent = agents.find((a) => a.id === id) ?? null;
  return { agent, status, error, reload };
}
