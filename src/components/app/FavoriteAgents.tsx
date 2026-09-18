"use client";

import { useAgents } from "@/hooks/useAgents";
import { useFavorites } from "@/hooks/useFavorites";
import { SIDEBAR_LIST_LIMIT, SidebarAgentList } from "./SidebarAgentList";

/** Starred agents. Favourites live in this browser, so the ids come from local storage. */
export function FavoriteAgents({ onNavigate }: { onNavigate?: () => void }) {
  const { agents, status } = useAgents();
  const { favorites } = useFavorites();
  const starred = agents.filter((agent) => favorites.has(agent.id));

  return (
    <SidebarAgentList
      title="Favorites"
      items={starred.slice(0, SIDEBAR_LIST_LIMIT)}
      // Only worth a skeleton when this browser knows there are some to wait for.
      loading={(status === "idle" || status === "loading") && agents.length === 0 && favorites.size > 0}
      empty={status === "error" ? "Couldn't load your agents." : "Star an agent to keep it here."}
      viewAllHref={starred.length > SIDEBAR_LIST_LIMIT ? "/agents/all" : undefined}
      onNavigate={onNavigate}
    />
  );
}
