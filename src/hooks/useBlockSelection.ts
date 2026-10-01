"use client";

import { useState, type SyntheticEvent } from "react";
import { caretRange, selectionPoint } from "@/lib/notes/dom";

/** A highlighted run inside one block, and where it starts on screen. */
export type BlockSelection = { blockId: string; start: number; end: number; x: number; y: number };

/**
 * What is highlighted, for the toolbar that appears over it.
 *
 * Bound to each block's `onSelect`, `onMouseUp` and `onKeyUp`, so a drag of the
 * mouse and a shift-arrow both land here — a contenteditable doesn't report
 * selection as reliably as a text field, and the three together do.
 */
export function useBlockSelection() {
  const [selection, setSelection] = useState<BlockSelection | null>(null);

  const read = (blockId: string) => (event: SyntheticEvent<HTMLElement>) => {
    const field = event.currentTarget;
    const range = caretRange(field);
    // A caret is not a selection: moving it puts the toolbar away.
    if (!range || range.start === range.end) {
      if (selection) setSelection(null);
      return;
    }
    if (selection?.blockId === blockId && selection.start === range.start && selection.end === range.end) return;
    const point = selectionPoint(field);
    if (point) setSelection({ blockId, ...range, ...point });
  };

  return { selection, read, clear: () => setSelection(null) };
}
