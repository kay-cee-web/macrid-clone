import type { KeyboardEvent } from "react";
import { caretRange } from "./dom";
import type { Block, BlockType } from "@/types/noteBlock";

export const LISTS: BlockType[] = ["bullet", "number", "todo"];

/** The part of `useBlockDoc` the keyboard needs. */
type Doc = {
  blocks: Block[];
  convert: (id: string, type: BlockType, text?: string) => void;
  insertAfter: (id: string, type?: BlockType) => string;
  backspace: (id: string) => void;
  focusOn: (id: string, caret?: number) => void;
};

/**
 * Enter, Backspace and the arrows — what the keys do once the "/" menu has had
 * its turn at them.
 *
 * The rules a document editor is judged on: Enter carries a list on and ends it
 * on an empty item, Backspace at the start loses the formatting before it loses
 * the words, and the arrows walk out of a block into its neighbour instead of
 * stopping at its edge.
 */
export function handleBlockKey(event: KeyboardEvent<HTMLElement>, block: Block, index: number, doc: Doc) {
  const field = event.currentTarget;
  const range = caretRange(field);
  const atStart = range?.start === 0 && range.end === 0;
  const atEnd = range?.end === (field.textContent?.length ?? 0);

  // Enter inside a code block is a newline; everywhere else it starts a block —
  // shift or not, because a block holds one line of markdown.
  if (event.key === "Enter" && block.type !== "code") {
    event.preventDefault();
    if (LISTS.includes(block.type) && !block.text.trim()) doc.convert(block.id, "text");
    else doc.insertAfter(block.id, LISTS.includes(block.type) ? block.type : "text");
    return;
  }
  if (event.key === "Backspace" && atStart) {
    event.preventDefault();
    doc.backspace(block.id);
    return;
  }
  if (event.key === "ArrowUp" && atStart && doc.blocks[index - 1]) {
    event.preventDefault();
    doc.focusOn(doc.blocks[index - 1].id);
  } else if (event.key === "ArrowDown" && atEnd && doc.blocks[index + 1]) {
    event.preventDefault();
    doc.focusOn(doc.blocks[index + 1].id, 0);
  }
}
