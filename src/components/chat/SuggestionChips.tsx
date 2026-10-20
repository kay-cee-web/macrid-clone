"use client";

import { useState } from "react";
import { PenLine, RefreshCw } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { ideasFor } from "@/data/ideas";
import { cn } from "@/lib/cn";

const PAGE = 3;

type SuggestionChipsProps = {
  category?: string;
  onPick: (text: string) => void;
  /** A pick sends straight away, so it's held back while a turn runs (or an agent is being created). */
  disabled?: boolean;
  className?: string;
};

const PILL = "inline-flex max-w-full items-center gap-2.5 rounded-full bg-raised/80 px-5 py-3 text-base text-muted transition-colors hover:bg-raised hover:text-ink disabled:pointer-events-none disabled:opacity-50";

/** A quiet row of standing tasks under the home composer. Cycles through the catalog. */
export function SuggestionChips({ category, onPick, disabled, className }: SuggestionChipsProps) {
  const ideas = ideasFor(category);
  const [offset, setOffset] = useState(0);
  const visible = Array.from({ length: Math.min(PAGE, ideas.length) }, (_, i) => ideas[(offset + i) % ideas.length]);
  const shuffle = () => setOffset((o) => (o + PAGE) % ideas.length);

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
      {visible.map((idea) => (
        <button
          key={`${idea.category}-${idea.title}`}
          type="button"
          title={idea.description}
          disabled={disabled}
          onClick={() => onPick(idea.description)}
          className={PILL}
        >
          <PenLine className="size-4 shrink-0" />
          <span className="min-w-0 truncate">{idea.title}</span>
        </button>
      ))}
      <IconButton label="Show other suggestions" onClick={shuffle} className="size-12 rounded-full bg-raised/80">
        <RefreshCw />
      </IconButton>
    </div>
  );
}
