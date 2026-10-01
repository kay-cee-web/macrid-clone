"use client";

import type { KeyboardEvent, SyntheticEvent } from "react";
import { kindOf } from "@/lib/notes/blockKinds";
import { cn } from "@/lib/cn";
import type { Block, BlockType } from "@/types/noteBlock";
import { BlockText } from "./BlockText";

/** How each kind reads. The markdown is the same text either way; only the type scale changes. */
const LOOK: Record<BlockType, string> = {
  text: "text-sm leading-relaxed",
  h1: "font-display text-2xl font-semibold tracking-tight",
  h2: "font-display text-xl font-semibold tracking-tight",
  h3: "text-base font-semibold",
  quote: "text-sm italic leading-relaxed text-muted",
  divider: "",
  bullet: "text-sm leading-relaxed",
  number: "text-sm leading-relaxed",
  todo: "text-sm leading-relaxed",
  code: "font-mono text-sm leading-relaxed",
  image: "font-mono text-xs text-muted",
};

type BlockBodyProps = {
  block: Block;
  /** Its place in the current run of numbered items. */
  number: number;
  focusKey: number;
  caret: number;
  onChange: (text: string) => void;
  onToggle: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onSelect: (event: SyntheticEvent<HTMLElement>) => void;
};

/** One block's content: its marker, if it has one, and the text. */
export function BlockBody({ block, number, ...on }: BlockBodyProps) {
  const kind = kindOf(block.type);

  if (block.type === "divider") return <hr className="my-3 border-line" />;

  return (
    <div
      className={cn(
        "flex items-start gap-2",
        block.type === "quote" && "border-l-2 border-line pl-3",
        block.type === "code" && "rounded-[10px] border border-line bg-raised px-3 py-2",
      )}
    >
      {/* The markers share the text's line box, so they sit on its first line. */}
      {block.type === "bullet" && (
        <span aria-hidden className="select-none text-sm leading-relaxed text-faint">•</span>
      )}
      {block.type === "number" && (
        <span aria-hidden className="select-none font-mono text-sm leading-relaxed text-faint">{number}.</span>
      )}
      {block.type === "todo" && (
        <input
          type="checkbox"
          checked={block.done}
          onChange={on.onToggle}
          aria-label={block.text || "To-do"}
          className="mt-1 size-3.5 shrink-0 accent-accent"
        />
      )}

      <div className="min-w-0 flex-1">
        {block.type === "image" && block.text && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={block.text} alt="" className="mb-1 max-h-80 rounded-[10px] border border-line object-contain" />
        )}
        <BlockText
          blockId={block.id}
          value={block.text}
          placeholder={kind.placeholder}
          label={kind.label}
          focusKey={on.focusKey}
          caret={on.caret}
          // Code and an image URL are read literally; everything else is drawn.
          plain={block.type === "code" || block.type === "image"}
          onChange={on.onChange}
          onKeyDown={on.onKeyDown}
          onSelect={on.onSelect}
          className={cn(LOOK[block.type], block.type === "todo" && block.done && "text-muted line-through")}
        />
      </div>
    </div>
  );
}
