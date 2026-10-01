"use client";

import { useState } from "react";
import { Baseline, Bold, Check, ChevronDown, Italic, Link2, Strikethrough } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Menu } from "@/components/ui/Menu";
import { NOTE_COLORS } from "@/data/noteColors";
import { BLOCK_KINDS, kindOf } from "@/lib/notes/blockKinds";
import { applyColor, applyLink, applyMark, reselect, type Mark } from "@/lib/notes/marks";
import type { BlockType } from "@/types/noteBlock";

const MARKS: { label: string; mark: Mark; Icon: typeof Bold }[] = [
  { label: "Bold", mark: "bold", Icon: Bold },
  { label: "Italic", mark: "italic", Icon: Italic },
  { label: "Strikethrough", mark: "strikeThrough", Icon: Strikethrough },
];

type ToolbarProps = {
  blockId: string;
  type: BlockType;
  start: number;
  end: number;
  x: number;
  y: number;
  onType: (type: BlockType) => void;
  onDone: () => void;
};

/**
 * The toolbar over a highlighted run.
 *
 * Nothing in it takes the focus — a press would otherwise drop the selection it
 * is about to act on — except the link field, which has to be typed into. That
 * one puts the selection back itself before it applies.
 */
export function SelectionToolbar({ blockId, type, start, end, x, y, onType, onDone }: ToolbarProps) {
  const [href, setHref] = useState<string | null>(null);

  const link = () => {
    const field = reselect(blockId, start, end);
    if (field) applyLink(href ?? "");
    setHref(null);
    onDone();
  };

  return (
    <div
      style={{ left: Math.max(0, x), top: y - 8 }}
      onMouseDown={(event) => href === null && event.preventDefault()}
      className="absolute z-40 flex -translate-y-full items-center gap-0.5 rounded-[10px] border border-line bg-surface p-1 shadow-float"
    >
      {href !== null ? (
        <>
          <input
            autoFocus
            value={href}
            onChange={(event) => setHref(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && link()}
            placeholder="Paste a link"
            aria-label="Link address"
            className="h-7 w-52 bg-transparent px-2 text-sm text-ink outline-none placeholder:text-faint"
          />
          <IconButton label="Apply link" size="sm" onClick={link}>
            <Check />
          </IconButton>
        </>
      ) : (
        <>
          <Menu
            align="start"
            items={BLOCK_KINDS.filter((kind) => kind.type !== "divider" && kind.type !== "image").map((kind) => ({
              label: kind.label,
              icon: <kind.Icon />,
              checked: kind.type === type,
              onSelect: () => onType(kind.type),
            }))}
            trigger={(props) => (
              <button
                type="button"
                {...props}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-ink transition-colors hover:bg-raised"
              >
                {kindOf(type).label}
                <ChevronDown className="size-3.5 text-muted" />
              </button>
            )}
          />

          <span aria-hidden className="mx-0.5 h-5 w-px bg-line" />

          {MARKS.map((entry) => (
            <IconButton
              key={entry.label}
              label={entry.label}
              size="sm"
              onClick={() => {
                applyMark(entry.mark);
                onDone();
              }}
            >
              <entry.Icon />
            </IconButton>
          ))}

          <IconButton label="Link" size="sm" onClick={() => setHref("")}>
            <Link2 />
          </IconButton>

          <Menu
            align="end"
            items={NOTE_COLORS.map((color) => ({
              label: color.name,
              icon: (
                <span
                  aria-hidden
                  style={color.hex ? { backgroundColor: color.hex } : undefined}
                  className={color.hex ? "size-3 rounded-full" : "size-3 rounded-full bg-ink"}
                />
              ),
              onSelect: () => {
                applyColor(color.hex);
                onDone();
              },
            }))}
            trigger={(props) => (
              <IconButton label="Colour" size="sm" {...props}>
                <Baseline />
              </IconButton>
            )}
          />
        </>
      )}
    </div>
  );
}
