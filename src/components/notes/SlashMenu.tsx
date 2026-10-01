"use client";

import { useEffect, useRef } from "react";
import { SLASH_GROUPS, type SlashOption } from "@/lib/notes/blockKinds";
import { cn } from "@/lib/cn";

/**
 * The "/" menu.
 *
 * Presentational on purpose: the caret stays in the block so typing keeps
 * filtering, which means the arrow keys and Enter are handled there and this
 * only has to draw the list and say which row is next.
 */
export function SlashMenu({
  options,
  active,
  onPick,
}: {
  options: SlashOption[];
  active: number;
  onPick: (option: SlashOption) => void;
}) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <div
      role="listbox"
      aria-label="Add a block"
      className="absolute left-0 top-full z-40 mt-1 max-h-72 w-60 animate-fade-in overflow-y-auto rounded-[12px] border border-line bg-surface p-1 shadow-float"
    >
      {options.length === 0 && <p className="px-2.5 py-2 text-xs text-muted">Nothing matches that.</p>}

      {SLASH_GROUPS.filter((group) => options.some((option) => option.group === group)).map((group) => (
        <div key={group}>
          <p className="px-2.5 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-faint">{group}</p>
          {options
            .filter((option) => option.group === group)
            .map((option) => {
              const index = options.indexOf(option);
              const selected = index === active;
              return (
                <button
                  key={option.key}
                  ref={selected ? activeRef : undefined}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  // The caret is in the block, so a press here must not steal it first.
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onPick(option)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm text-ink",
                    "transition-colors [&_svg]:size-4 [&_svg]:text-muted",
                    selected ? "bg-raised" : "hover:bg-raised/60",
                  )}
                >
                  <option.Icon />
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })}
        </div>
      ))}
    </div>
  );
}
