"use client";

import { useState, type ReactNode } from "react";
import { Bot, CircleAlert, Plus, SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { HairlineGrid } from "@/components/ui/HairlineGrid";
import { Skeleton } from "@/components/ui/Skeleton";
import { TileGrid } from "@/components/ui/TileGrid";
import { CATEGORIES } from "@/data/ideas";
import { useAgents } from "@/hooks/useAgents";
import { useCreateAgent } from "@/hooks/useCreateAgent";
import { categoryOf } from "@/lib/agents/category";
import { DEFAULT_SORT, filterAgents, sortAgents, type AgentSort } from "@/lib/agents/sort";
import type { AgentDialog } from "./AgentActionsMenu";
import { AgentCard } from "./AgentCard";
import { AgentDialogs } from "./AgentDialogs";
import { AgentsToolbar, type CatalogView, type CategoryFilter } from "./AgentsToolbar";
import { HubTabs } from "./HubTabs";

function Layout({ view, count, children }: { view: CatalogView; count: number; children: ReactNode }) {
  return view === "grid" ? (
    <TileGrid className="gap-7">{children}</TileGrid>
  ) : (
    <HairlineGrid itemCount={count} columns="single">
      {children}
    </HairlineGrid>
  );
}

export function AgentsCatalog() {
  const { agents, status, error, reload } = useAgents();
  const { create, creating } = useCreateAgent();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<AgentSort>(DEFAULT_SORT);
  const [view, setView] = useState<CatalogView>("grid");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [dialog, setDialog] = useState<AgentDialog>(null);

  const categorized = agents.map((agent) => ({ agent, category: categoryOf(agent) }));
  const present = CATEGORIES.filter((c) => categorized.some((item) => item.category === c));
  // A category can empty out (e.g. after a delete); fall back to All rather than an empty page.
  const active: CategoryFilter = category !== "all" && present.includes(category) ? category : "all";
  const inCategory = categorized.filter((item) => active === "all" || item.category === active).map((item) => item.agent);
  const visible = sortAgents(filterAgents(inCategory, query), sort);
  const loading = (status === "idle" || status === "loading") && agents.length === 0;

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
  };

  return (
    <div className="mx-auto grid w-full max-w-400 gap-8 px-4 pb-20 pt-10 sm:px-8 xl:px-14">
      <HubTabs />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-2">
          <h1 className="font-sans text-2xl font-normal tracking-normal text-ink">Agents</h1>
          <p className="text-sm text-muted">
            {status === "ready"
              ? `${agents.length} ${agents.length === 1 ? "agent" : "agents"} you've made. Open one to chat, or clone it as a starting point.`
              : "Every agent you've made. Open one to chat, or clone it as a starting point."}
          </p>
        </div>
        <Button icon={<Plus className="size-4" />} loading={creating} onClick={() => void create()} className="h-10 rounded-lg px-4">
          New agent
        </Button>
      </header>

      <AgentsToolbar
        query={query}
        onQuery={setQuery}
        sort={sort}
        onSort={setSort}
        view={view}
        onView={setView}
        category={active}
        onCategory={setCategory}
        categories={present}
      />

      {status === "error" && agents.length === 0 ? (
        <EmptyState
          tone="bad"
          icon={<CircleAlert />}
          title="Couldn't load your agents"
          description={error}
          action={<Button variant="secondary" onClick={() => void reload()}>Try again</Button>}
        />
      ) : loading ? (
        <Layout view={view} count={6}>
          {Array.from({ length: 6 }, (_, i) =>
            view === "grid" ? (
              <div key={i} className="grid gap-8 rounded-3xl border border-line bg-raised/40 p-6">
                <Skeleton className="size-12 rounded-full" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div key={i} className="flex items-center gap-4 bg-surface px-4 py-3">
                <Skeleton className="size-9 rounded-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ),
          )}
        </Layout>
      ) : agents.length === 0 ? (
        <EmptyState
          icon={<Bot />}
          title="No agents yet"
          description="Create an agent, then tell it what you'd otherwise do by hand in Dexisphere."
          action={<Button onClick={() => void create()} loading={creating}>Create your first agent</Button>}
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<SearchX />}
          title="No agents match"
          description={query.trim() ? `Nothing matches “${query.trim()}”. Try a different word.` : "No agents in this category."}
          action={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
        />
      ) : (
        <Layout view={view} count={visible.length}>
          {visible.map((agent) => (
            <AgentCard key={agent.id} agent={agent} layout={view} onDialog={setDialog} />
          ))}
        </Layout>
      )}

      <AgentDialogs dialog={dialog} onClose={() => setDialog(null)} />
    </div>
  );
}
