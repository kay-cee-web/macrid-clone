"use client";

import { useState } from "react";
import { CATEGORIES, ideasFor } from "@/data/ideas";
import { FilterChips } from "@/components/ui/FilterChips";
import { TileGrid } from "@/components/ui/TileGrid";
import type { Idea, IdeaCategory } from "@/types/idea";
import { IdeaCard } from "./IdeaCard";

type Filter = "all" | IdeaCategory;

/** Standing tasks as template tiles, filtered by category. */
export function IdeaBrowser({ onPick }: { onPick: (idea: Idea) => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const ideas = ideasFor(filter === "all" ? null : filter);
  const ready = ideas.filter((idea) => idea.ready).length;

  return (
    <section aria-labelledby="ideas-heading" className="grid gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="ideas-heading" className="text-xl font-medium">
          Start from a standing task
        </h2>
        <span className="text-sm text-muted">
          {ready} of {ideas.length} ready today
        </span>
      </div>

      <FilterChips
        label="Task categories"
        value={filter}
        onChange={setFilter}
        items={[{ value: "all", label: "All" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
      />

      <div role="tabpanel" aria-label={filter === "all" ? "All tasks" : filter}>
        <TileGrid>
          {ideas.map((idea) => (
            <IdeaCard key={`${idea.category}-${idea.title}`} idea={idea} onPick={onPick} action="Draft" />
          ))}
        </TileGrid>
      </div>
    </section>
  );
}
