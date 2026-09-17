"use client";

import { ChevronDown, LayoutGrid, List, Search } from "lucide-react";
import { FilterChips } from "@/components/ui/FilterChips";
import { Input } from "@/components/ui/Input";
import { Menu } from "@/components/ui/Menu";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { buttonStyles } from "@/components/ui/button-styles";
import { SORT_OPTIONS, type AgentSort } from "@/lib/agents/sort";
import type { IdeaCategory } from "@/types/idea";

export type CatalogView = "grid" | "list";
export type CategoryFilter = "all" | IdeaCategory;

type AgentsToolbarProps = {
  query: string;
  onQuery: (query: string) => void;
  sort: AgentSort;
  onSort: (sort: AgentSort) => void;
  view: CatalogView;
  onView: (view: CatalogView) => void;
  category: CategoryFilter;
  onCategory: (category: CategoryFilter) => void;
  /** Categories that at least one agent falls in. */
  categories: IdeaCategory[];
};

/** Sort, then category tags; search and layout pushed to the far right. */
export function AgentsToolbar(props: AgentsToolbarProps) {
  const { query, onQuery, sort, onSort, view, onView, category, onCategory, categories } = props;
  const sortLabel = SORT_OPTIONS.find((option) => option.id === sort)?.label ?? "Sort";

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <Menu
        align="start"
        items={SORT_OPTIONS.map((option) => ({
          label: option.label,
          checked: option.id === sort,
          onSelect: () => onSort(option.id),
        }))}
        trigger={(triggerProps) => (
          <button
            type="button"
            {...triggerProps}
            className={buttonStyles({ variant: "secondary", className: "h-10 w-44 justify-between rounded-lg px-4 font-normal" })}
          >
            {sortLabel}
            <ChevronDown className="size-4 text-muted" />
          </button>
        )}
      />

      {categories.length > 1 && (
        <FilterChips
          variant="outline"
          label="Agent categories"
          value={category}
          onChange={onCategory}
          items={[{ value: "all", label: "All" }, ...categories.map((c) => ({ value: c, label: c }))]}
          className="min-w-0 max-w-full"
        />
      )}

      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <label htmlFor="agent-search" className="sr-only">
          Search agents
        </label>
        <Input
          id="agent-search"
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search"
          leading={<Search />}
          className="h-10 w-full min-w-0 rounded-lg border-transparent bg-raised sm:w-80"
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
    </div>
  );
}
