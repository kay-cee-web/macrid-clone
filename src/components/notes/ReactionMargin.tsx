"use client";

import { useState } from "react";
import { Smile } from "lucide-react";
import { cn } from "@/lib/cn";
import { reactionsIn, removeReaction, spotlight } from "@/lib/notes/reactions";

const PILL =
  "inline-flex h-7 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 text-sm text-ink shadow-xs transition-colors";

/**
 * A block's reactions, beside it in the right margin (under it on narrower
 * screens). One shows as itself; several stack behind a "☺ 3" count that fans
 * out on hover or a click. Each is a button: pressing it takes it off, and
 * pointing at it rings the text it belongs to.
 */
export function ReactionMargin({ blockId, text }: { blockId: string; text: string }) {
  const [open, setOpen] = useState(false);
  const pills = reactionsIn(text).flatMap((reaction) =>
    reaction.emojis.map((emoji) => ({ index: reaction.index, emoji })),
  );
  if (!pills.length) return null;

  const stacked = pills.length > 1;

  return (
    <div
      className="group/react mt-1 2xl:absolute 2xl:left-full 2xl:top-0 2xl:mt-0 2xl:ml-8"
      onMouseLeave={() => setOpen(false)}
    >
      {stacked && (
        <button
          type="button"
          aria-expanded={open}
          aria-label={`${pills.length} reactions`}
          onClick={() => setOpen((v) => !v)}
          className={cn(PILL, "border-transparent bg-transparent text-muted shadow-none hover:text-ink", open && "hidden", "can-hover:group-hover/react:hidden")}
        >
          <Smile className="size-4" />
          <span className="font-mono text-xs tabular-nums">{pills.length}</span>
        </button>
      )}

      <ul
        className={cn(
          "flex flex-wrap gap-1.5 2xl:w-max 2xl:flex-col",
          stacked && !open && "hidden can-hover:group-hover/react:flex",
        )}
      >
        {pills.map(({ index, emoji }) => (
          <li key={`${index}-${emoji}`}>
            <button
              type="button"
              title="Remove reaction"
              aria-label={`Remove ${emoji} reaction`}
              onClick={() => {
                spotlight(blockId, index, false);
                removeReaction(blockId, index, emoji);
              }}
              onMouseEnter={() => spotlight(blockId, index, true)}
              onMouseLeave={() => spotlight(blockId, index, false)}
              onFocus={() => spotlight(blockId, index, true)}
              onBlur={() => spotlight(blockId, index, false)}
              className={cn(PILL, "border-accent/30 bg-accent-soft hover:border-bad/40 hover:bg-bad-soft")}
            >
              <span aria-hidden>{emoji}</span>
              <span className="font-mono text-xs tabular-nums text-muted">1</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
