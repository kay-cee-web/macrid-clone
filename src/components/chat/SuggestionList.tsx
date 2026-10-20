"use client";

import { cn } from "@/lib/cn";
import type { Suggestion } from "@/types/suggestion";

type SuggestionListProps = {
  items: Suggestion[];
  onPick: (text: string) => void;
  /** A pick sends straight away, so it's held back while a turn runs. */
  disabled?: boolean;
  className?: string;
};

/** The "Suggestions" box: one row per thing to ask next. Used by the greeting and under the latest reply. */
export function SuggestionList({ items, onPick, disabled, className }: SuggestionListProps) {
  if (!items.length) return null;
  return (
    <div className={cn("grid gap-1 rounded-xl border border-line bg-surface p-2", className)}>
      <span className="px-2 pb-1 pt-0.5 text-xs text-muted">Suggestions</span>
      {items.map(({ label, text, Icon }) => (
        <button
          key={label}
          type="button"
          title={text}
          disabled={disabled}
          onClick={() => onPick(text)}
          className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-ink transition-colors hover:bg-raised disabled:pointer-events-none disabled:opacity-50"
        >
          <Icon className="size-4 shrink-0 text-muted" />
          <span className="min-w-0 truncate">{label}</span>
        </button>
      ))}
    </div>
  );
}
