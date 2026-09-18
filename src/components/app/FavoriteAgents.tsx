"use client";

import { useAgents } from "@/hooks/useAgents";
import { SIDEBAR_LIST_LIMIT, SidebarAgentList } from "./SidebarAgentList";

/** Starred agents, behind a disclosure. `favorite` comes from the agent row. */
export function FavoriteAgents({ onNavigate }: { onNavigate?: () => void }) {
  const { agents, status } = useAgents();
  const starred = agents.filter((agent) => agent.favorite);

  return (
    <SidebarAgentList
      title="Favorites"
      storageKey="sidebar.favorites.open"
      items={starred.slice(0, SIDEBAR_LIST_LIMIT)}
      loading={(status === "idle" || status === "loading") && agents.length === 0}
      empty={status === "error" ? "Couldn't load your agents." : "Star an agent to keep it here."}
      viewAllHref={starred.length > SIDEBAR_LIST_LIMIT ? "/agents/all" : undefined}
      onNavigate={onNavigate}
    />
  );
}
