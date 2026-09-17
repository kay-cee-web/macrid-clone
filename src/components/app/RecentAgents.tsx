"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { AgentAvatar } from "@/components/agents/AgentAvatar";
import { useAgents } from "@/hooks/useAgents";
import { NavLink } from "./NavLink";

const RECENTS_LIMIT = 3;

/** The agents touched most recently (the store is already sorted by edit time). */
export function RecentAgents({ onNavigate }: { onNavigate?: () => void }) {
  const { agents, status } = useAgents();
  const recents = agents.slice(0, RECENTS_LIMIT);

  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between px-3 pb-1">
        <span className="text-sm text-muted">Recents</span>
        {agents.length > RECENTS_LIMIT && (
          <Link href="/agents/all" onClick={onNavigate} className="text-sm text-muted hover:text-ink">
            View all
          </Link>
        )}
      </div>

      {(status === "idle" || status === "loading") && agents.length === 0 &&
        Array.from({ length: RECENTS_LIMIT }, (_, i) => (
          <div key={i} className="flex items-center gap-2.5 px-2 py-1.5">
            <Skeleton className="size-5 rounded-md" />
            <Skeleton className="h-3 flex-1" />
          </div>
        ))}

      {status === "ready" && agents.length === 0 && (
        <p className="px-2 py-1 text-xs text-faint">Agents you create show up here.</p>
      )}
      {status === "error" && agents.length === 0 && (
        <p className="px-2 py-1 text-xs text-faint">Couldn&apos;t load your agents.</p>
      )}

      {recents.map((agent) => (
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
