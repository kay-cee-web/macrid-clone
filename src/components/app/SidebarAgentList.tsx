"use client";

import Link from "next/link";
import { AgentAvatar } from "@/components/agents/AgentAvatar";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Agent } from "@/types/agent";
import { NavLink } from "./NavLink";

export const SIDEBAR_LIST_LIMIT = 3;

type SidebarAgentListProps = {
  title: string;
  /** Already sliced to what should show. */
  items: Agent[];
  loading: boolean;
  /** One line for when there's nothing to list. */
  empty: string;
  /** Set only when there is more to see than fits. */
  viewAllHref?: string;
  onNavigate?: () => void;
};

/** A short, titled list of agents in the sidebar — shared by Favorites and Recents. */
export function SidebarAgentList({ title, items, loading, empty, viewAllHref, onNavigate }: SidebarAgentListProps) {
  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between px-3 pb-1">
        <span className="text-sm text-muted">{title}</span>
        {viewAllHref && (
          <Link href={viewAllHref} onClick={onNavigate} className="text-sm text-muted hover:text-ink">
            View all
          </Link>
        )}
      </div>

      {loading &&
        Array.from({ length: SIDEBAR_LIST_LIMIT }, (_, i) => (
          <div key={i} className="flex items-center gap-2.5 px-2 py-1.5">
            <Skeleton className="size-5 rounded-md" />
            <Skeleton className="h-3 flex-1" />
          </div>
        ))}

      {!loading && items.length === 0 && <p className="px-2 py-1 text-xs text-faint">{empty}</p>}

      {items.map((agent) => (
        <NavLink
          key={agent.id}
          href={`/agents/${agent.id}`}
          matchPrefix
          onNavigate={onNavigate}
          className="py-1.5 text-sm"
          icon={<AgentAvatar name={agent.name} size="xs" />}
        >
          <span className="flex items-center gap-2">
            <span className="truncate">{agent.name}</span>
            {!agent.sendingEnabled && (
              <span title="Sending is off" className="size-1.5 shrink-0 rounded-full bg-warn" />
            )}
          </span>
        </NavLink>
      ))}
    </div>
  );
}
