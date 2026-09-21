"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, ideasFor } from "@/data/ideas";
import { buttonStyles } from "@/components/ui/button-styles";
import { FilterChips } from "@/components/ui/FilterChips";
import { TileGrid } from "@/components/ui/TileGrid";
import type { Idea, IdeaCategory } from "@/types/idea";
import { IdeaCard } from "./IdeaCard";

type Filter = "all" | IdeaCategory;

type IdeaBrowserProps = {
  onPick: (idea: Idea) => void;
  /** null when the page already has a heading of its own (the workbench). */
  heading?: string | null;
  /** The label on each card's button. */
  action?: string;
  /** Show only this many tiles (home), with a "View all" link to `moreHref` when there are more. */
  limit?: number;
  moreHref?: string;
  /** While a picked task is being turned into an agent. */
  disabled?: boolean;
};

/** Standing tasks as template tiles, filtered by category. */
export function IdeaBrowser({
  onPick, heading = "Start from a standing task", action = "Start", limit, moreHref, disabled,
}: IdeaBrowserProps) {
  const headingId = useId();
  const [filter, setFilter] = useState<Filter>("all");
  const ideas = ideasFor(filter === "all" ? null : filter);
  const ready = ideas.filter((idea) => idea.ready).length;
  const shown = limit ? ideas.slice(0, limit) : ideas;
  const more = moreHref && shown.length < ideas.length;

  return (
    <section aria-labelledby={heading ? headingId : undefined} aria-label={heading ? undefined : "Workflows"} className="grid gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        {heading && (
          <h2 id={headingId} className="text-xl font-medium">
            {heading}
          </h2>
        )}
        <span className="ml-auto text-sm text-muted">
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
          {shown.map((idea) => (
            <IdeaCard
              key={`${idea.category}-${idea.title}`}
              idea={idea}
              variant="cover"
              onPick={onPick}
              action={action}
              disabled={disabled}
            />
          ))}
        </TileGrid>
      </div>

      {more && (
        <Link href={moreHref} className={buttonStyles({ variant: "secondary", size: "lg", className: "justify-self-center" })}>
          View all {ideas.length} workflows
          <ArrowRight className="size-4" />
        </Link>
      )}
    </section>
  );
}
