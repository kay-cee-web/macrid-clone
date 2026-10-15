"use client";

import { useState } from "react";
import { Baseline, Bold, Braces, Check, Italic, Link2, List, Smile, Strikethrough, Underline } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Menu } from "@/components/ui/Menu";
import { NOTE_COLORS } from "@/data/noteColors";
import { kindOf } from "@/lib/notes/blockKinds";
import { applyColor, applyLink, applyMark, reselect, toggleInlineCode, type Mark } from "@/lib/notes/marks";
import type { BlockType } from "@/types/noteBlock";
import { ReactionPicker } from "./ReactionPicker";
import { ToolbarKindMenu } from "./ToolbarKindMenu";

const MARKS: { label: string; mark: Mark; Icon: typeof Bold }[] = [
  { label: "Bold", mark: "bold", Icon: Bold },
  { label: "Italic", mark: "italic", Icon: Italic },
  { label: "Underline", mark: "underline", Icon: Underline },
  { label: "Strikethrough", mark: "strikeThrough", Icon: Strikethrough },
];

const TEXT_KINDS: BlockType[] = ["text", "h1", "h2", "h3", "quote", "code"];
const LIST_KINDS: BlockType[] = ["bullet", "number", "todo"];

function Divider() {
  return <span aria-hidden className="mx-1 h-5 w-px bg-line" />;
}

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
 * The toolbar over a highlighted run: react, text style, marks, colour, list
 * and link. Reacting swaps the row for a line of emoji (`ReactionPicker`).
 *
 * Nothing in it takes the focus — a press would otherwise drop the selection it
 * is about to act on — except the link field, which has to be typed into. That
 * one puts the selection back itself before it applies.
 */
export function SelectionToolbar({ blockId, type, start, end, x, y, onType, onDone }: ToolbarProps) {
  const [href, setHref] = useState<string | null>(null);
  const [reacting, setReacting] = useState(false);
  const ListIcon = LIST_KINDS.includes(type) ? kindOf(type).Icon : List;

  const link = () => {
    const field = reselect(blockId, start, end);
    if (field) applyLink(href ?? "");
    setHref(null);
    onDone();
  };

  /** A mark applies, then the toolbar steps aside. */
  const act = (apply: () => void) => () => {
    apply();
    onDone();
  };

  return (
    <div
      style={{ left: Math.max(0, x), top: y - 10 }}
      onMouseDown={(event) => href === null && event.preventDefault()}
      className="absolute z-40 flex -translate-y-full items-center gap-0.5 rounded-xl border border-line bg-surface p-1 shadow-float"
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
      ) : reacting ? (
        <ReactionPicker onDone={onDone} />
      ) : (
        <>
          {/* A code block is shown as typed, so a reaction mark would show up as text. */}
          {type !== "code" && (
            <>
              <IconButton label="React" size="sm" onClick={() => setReacting(true)}>
                <Smile />
              </IconButton>
              <Divider />
            </>
          )}
          <ToolbarKindMenu
            types={TEXT_KINDS}
            current={type}
            onType={onType}
            label="Text style"
            face={<span className="font-medium">Aa</span>}
            chip
          />
          <Divider />

          {MARKS.map((entry) => (
            <IconButton key={entry.label} label={entry.label} size="sm" onClick={act(() => applyMark(entry.mark))}>
              <entry.Icon />
            </IconButton>
          ))}
          <IconButton label="Inline code" size="sm" onClick={act(toggleInlineCode)}>
            <Braces />
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
              onSelect: act(() => applyColor(color.hex)),
            }))}
            trigger={(props) => (
              <IconButton label="Text colour" size="sm" {...props}>
                <Baseline />
              </IconButton>
            )}
          />
          <Divider />

          <ToolbarKindMenu types={LIST_KINDS} current={type} onType={onType} label="List" face={<ListIcon />} />
          <Divider />

          <IconButton label="Link" size="sm" onClick={() => setHref("")}>
            <Link2 />
          </IconButton>
        </>
      )}
    </div>
  );
}
