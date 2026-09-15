"use client";

import { useState } from "react";
import { Bot, CircleAlert, Plus, SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { HairlineGrid } from "@/components/ui/HairlineGrid";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAgents } from "@/hooks/useAgents";
import { useCreateAgent } from "@/hooks/useCreateAgent";
import { DEFAULT_SORT, filterAgents, sortAgents, type AgentSort } from "@/lib/agents/sort";
import type { AgentDialog } from "./AgentActionsMenu";
import { AgentCard } from "./AgentCard";
import { AgentDialogs } from "./AgentDialogs";
import { AgentsToolbar, type CatalogView } from "./AgentsToolbar";

export function AgentsCatalog() {
  const { agents, status, error, reload } = useAgents();
  const { create, creating } = useCreateAgent();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<AgentSort>(DEFAULT_SORT);
  const [view, setView] = useState<CatalogView>("grid");
  const [dialog, setDialog] = useState<AgentDialog>(null);

  const visible = sortAgents(filterAgents(agents, query), sort);
  const loading = (status === "idle" || status === "loading") && agents.length === 0;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-20 pt-10 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <h1 className="text-[32px] font-semibold leading-tight">All agents</h1>
          <p className="text-[14px] text-muted">
            {status === "ready" ? `${agents.length} ${agents.length === 1 ? "agent" : "agents"}` : "Your agents"}
          </p>
        </div>
        <Button icon={<Plus className="size-4" />} loading={creating} onClick={() => void create()}>
          New agent
        </Button>
      </header>

      <AgentsToolbar query={query} onQuery={setQuery} sort={sort} onSort={setSort} view={view} onView={setView} />

      {status === "error" && agents.length === 0 ? (
        <EmptyState
          tone="bad"
          icon={<CircleAlert />}
          title="Couldn't load your agents"
          description={error}
          action={<Button variant="secondary" onClick={() => void reload()}>Try again</Button>}
        />
      ) : loading ? (
        <HairlineGrid itemCount={6} columns={view === "grid" ? "responsive" : "single"}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="grid gap-3 bg-surface p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-[10px]" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              {view === "grid" && <Skeleton className="h-9 w-full" />}
            </div>
          ))}
        </HairlineGrid>
      ) : agents.length === 0 ? (
        <EmptyState
          icon={<Bot />}
          title="No agents yet"
          description="Create an agent, then tell it what you'd otherwise do by hand in Macrid."
          action={<Button onClick={() => void create()} loading={creating}>Create your first agent</Button>}
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<SearchX />}
          title="No agents match"
          description={`Nothing matches “${query.trim()}”. Try a different word.`}
          action={<Button variant="secondary" onClick={() => setQuery("")}>Clear search</Button>}
        />
      ) : (
        <HairlineGrid itemCount={visible.length} columns={view === "grid" ? "responsive" : "single"}>
          {visible.map((agent) => (
            <AgentCard key={agent.id} agent={agent} layout={view} onDialog={setDialog} />
          ))}
        </HairlineGrid>
      )}

      <AgentDialogs dialog={dialog} onClose={() => setDialog(null)} />
    </div>
  );
}
