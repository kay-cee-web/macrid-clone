"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { ideasFor } from "@/data/ideas";

const PAGE = 3;

/** A few standing tasks to start from; picking one drafts it. Cycles through the catalog. */
export function SuggestionChips({ category, onPick }: { category?: string; onPick: (text: string) => void }) {
  const ideas = ideasFor(category);
  const [offset, setOffset] = useState(0);
  const visible = Array.from({ length: Math.min(PAGE, ideas.length) }, (_, i) => ideas[(offset + i) % ideas.length]);

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] text-muted">Try one of these</span>
        <IconButton size="sm" label="Show other suggestions" onClick={() => setOffset((o) => (o + PAGE) % ideas.length)}>
          <RefreshCw />
        </IconButton>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {visible.map((idea) => (
          <button
            key={`${idea.category}-${idea.title}`}
            type="button"
            onClick={() => onPick(idea.description)}
            className="grid content-start gap-1 rounded-[12px] border border-line bg-surface p-3 text-left transition-colors hover:border-faint hover:bg-raised"
          >
            <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-faint">{idea.category}</span>
            <span className="text-[13.5px] font-medium leading-snug text-ink">{idea.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
