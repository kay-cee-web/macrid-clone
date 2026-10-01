import type { KeyboardEvent } from "react";
import { handleBlockKey } from "./blockKeys";
import { shortcutFor } from "./blocks";
import type { SlashOption } from "./blockKinds";
import type { Block, BlockType } from "@/types/noteBlock";

/** The parts of the editor's three hooks this needs, named structurally so the dependency runs one way. */
type Doc = {
  blocks: Block[];
  update: (id: string, patch: Partial<Block>) => void;
  convert: (id: string, type: BlockType, text?: string) => void;
  insertAfter: (id: string, type?: BlockType) => string;
  backspace: (id: string) => void;
  focusOn: (id: string, caret?: number) => void;
};

type Slash = {
  options: SlashOption[];
  isOpen: (blockId: string) => boolean;
  current: () => SlashOption | undefined;
  open: (blockId: string, query?: string) => void;
  close: () => void;
  step: (delta: number) => void;
  menu: { blockId: string } | null;
};

type Highlight = { clear: () => void };

/** What the editor does in response to a key or a menu pick. */
export function blockEditing(doc: Doc, slash: Slash, highlight: Highlight, onNewNote: () => void) {
  const pick = (option: SlashOption) => {
    const id = slash.menu?.blockId;
    slash.close();
    if (!id) return;
    // `convert` leaves the caret in the block, so picking a kind puts you on the
    // new line ready to write it. The "/" and the text typed to filter by are
    // the command, never the content.
    if (option.type) doc.convert(id, option.type, "");
    else onNewNote();
  };

  const change = (block: Block, text: string) => {
    if (block.type !== "code" && text.startsWith("/")) {
      slash.open(block.id, text.slice(1));
      doc.update(block.id, { text });
      return;
    }
    if (slash.isOpen(block.id)) slash.close();
    // "## " and "- " convert a plain line; inside a heading they are just text.
    const shortcut = block.type === "text" ? shortcutFor(text) : null;
    if (shortcut) doc.convert(block.id, shortcut.type, shortcut.text);
    else doc.update(block.id, { text });
  };

  /** The menu gets first refusal on a key; whatever it doesn't want edits the note. */
  const keys =
    (block: Block, index: number) =>
    (event: KeyboardEvent<HTMLElement>) => {
      if (slash.isOpen(block.id) && slash.options.length) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          slash.step(event.key === "ArrowDown" ? 1 : -1);
          return;
        }
        if (event.key === "Enter" || event.key === "Tab") {
          event.preventDefault();
          const option = slash.current();
          if (option) pick(option);
          return;
        }
      }
      if (event.key === "Escape") return slash.close();
      handleBlockKey(event, block, index, doc);
    };

  return { pick, change, keys };
}
