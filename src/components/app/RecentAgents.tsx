"use client";

import { useAgents } from "@/hooks/useAgents";
import { SIDEBAR_LIST_LIMIT, SidebarAgentList } from "./SidebarAgentList";

/** The agents touched most recently (the store is already sorted by edit time). */
export function RecentAgents({ onNavigate }: { onNavigate?: () => void }) {
  const { agents, status } = useAgents();

  return (
    <SidebarAgentList
      title="Recents"
      items={agents.slice(0, SIDEBAR_LIST_LIMIT)}
      loading={(status === "idle" || status === "loading") && agents.length === 0}
      empty={status === "error" ? "Couldn't load your agents." : "Agents you create show up here."}
      viewAllHref={agents.length > SIDEBAR_LIST_LIMIT ? "/agents/all" : undefined}
      onNavigate={onNavigate}
    />
  );
}
