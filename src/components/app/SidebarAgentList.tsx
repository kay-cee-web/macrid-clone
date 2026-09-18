"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AgentAvatar } from "@/components/agents/AgentAvatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { readOpenSections, serverOpenSections, subscribeToSections, toggleSection } from "@/lib/ui/sections";
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
  /** Turns the title into a disclosure; the open state is kept per browser. */
  storageKey?: string;
  onNavigate?: () => void;
};

/** A short, titled list of agents in the sidebar — shared by Favorites and Recents. */
export function SidebarAgentList({
  title, items, loading, empty, viewAllHref, storageKey, onNavigate,
}: SidebarAgentListProps) {
  const openSections = useSyncExternalStore(subscribeToSections, readOpenSections, serverOpenSections);
  const open = storageKey ? openSections.has(storageKey) : true;
  const toggle = () => storageKey && toggleSection(storageKey);
  const bodyId = `${title.toLowerCase()}-agents`;

  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between gap-2 px-3 pb-1">
        {storageKey ? (
          // The whole row opens the section, with the chevron on the far right.
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={bodyId}
            className="-mx-1 flex min-w-0 flex-1 items-center justify-between gap-2 rounded px-1 text-sm text-muted transition-colors hover:text-ink"
          >
            <span className="truncate">{title}</span>
            <ChevronRight className={cn("size-3.5 shrink-0 transition-transform", open && "rotate-90")} />
          </button>
        ) : (
          <>
            <span className="text-sm text-muted">{title}</span>
            {viewAllHref && (
              <Link href={viewAllHref} onClick={onNavigate} className="shrink-0 text-sm text-muted hover:text-ink">
                View all
              </Link>
            )}
          </>
        )}
      </div>

      {open && (
        <div id={bodyId} className="grid gap-1">
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

          {/* A disclosure's header is the chevron's, so "View all" sits under the list. */}
          {storageKey && viewAllHref && (
            <Link
              href={viewAllHref}
              onClick={onNavigate}
              className="px-2 py-1 text-xs text-muted transition-colors hover:text-ink"
            >
              View all
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
