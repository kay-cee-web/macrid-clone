"use client";

import { ArrowUpDown, LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Menu } from "@/components/ui/Menu";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { SORT_OPTIONS, type AgentSort } from "@/lib/agents/sort";

export type CatalogView = "grid" | "list";

type AgentsToolbarProps = {
  query: string;
  onQuery: (query: string) => void;
  sort: AgentSort;
  onSort: (sort: AgentSort) => void;
  view: CatalogView;
  onView: (view: CatalogView) => void;
};

export function AgentsToolbar({ query, onQuery, sort, onSort, view, onView }: AgentsToolbarProps) {
  const sortLabel = SORT_OPTIONS.find((option) => option.id === sort)?.label ?? "Sort";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="agent-search" className="sr-only">
        Search agents
      </label>
      <Input
        id="agent-search"
        type="search"
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder="Search by name or instructions"
        leading={<Search />}
        className="h-9 min-w-0 flex-1 basis-60"
      />
      <Menu
        align="end"
        items={SORT_OPTIONS.map((option) => ({
          label: option.label,
          checked: option.id === sort,
          onSelect: () => onSort(option.id),
        }))}
        trigger={(props) => (
          <Button variant="secondary" icon={<ArrowUpDown className="size-3.5" />} {...props}>
            {sortLabel}
          </Button>
        )}
      />
      <SegmentedControl
        label="Layout"
        value={view}
        onChange={onView}
        options={[
          { value: "grid", label: "Grid view", icon: <LayoutGrid />, iconOnly: true },
          { value: "list", label: "List view", icon: <List />, iconOnly: true },
        ]}
      />
    </div>
  );
}
