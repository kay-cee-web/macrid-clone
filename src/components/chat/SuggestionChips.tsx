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
  /** "cards" under a heading (chat), or a quiet row of pills (home, under the composer). */
  variant?: "cards" | "pills";
  className?: string;
};

/** A few standing tasks to start from; picking one drafts it. Cycles through the catalog. */
export function SuggestionChips({ category, onPick, variant = "cards", className }: SuggestionChipsProps) {
  const ideas = ideasFor(category);
  const [offset, setOffset] = useState(0);
  const visible = Array.from({ length: Math.min(PAGE, ideas.length) }, (_, i) => ideas[(offset + i) % ideas.length]);
  const shuffle = () => setOffset((o) => (o + PAGE) % ideas.length);

  if (variant === "pills") {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
        {visible.map((idea) => (
          <button
            key={`${idea.category}-${idea.title}`}
            type="button"
            title={idea.description}
            onClick={() => onPick(idea.description)}
            className="inline-flex max-w-full items-center gap-2.5 rounded-full bg-raised/80 px-5 py-3 text-base text-muted transition-colors hover:bg-raised hover:text-ink"
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

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">Try one of these</span>
        <IconButton size="sm" label="Show other suggestions" onClick={shuffle}>
          <RefreshCw />
        </IconButton>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {visible.map((idea) => (
          <button
            key={`${idea.category}-${idea.title}`}
            type="button"
            onClick={() => onPick(idea.description)}
            className="grid content-start gap-1 rounded-xl border border-line bg-surface p-3 text-left transition-colors hover:border-faint hover:bg-raised"
          >
            <span className="font-mono text-xs uppercase tracking-[0.06em] text-faint">{idea.category}</span>
            <span className="text-sm font-medium leading-snug text-ink">{idea.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
