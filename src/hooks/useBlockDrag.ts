"use client";

import { useState, type DragEvent } from "react";

export type DropEdge = "top" | "bottom" | null;

/**
 * Dragging a block by its grip.
 *
 * The grip keeps its click menu — the menu is how this works without a mouse,
 * and Move up / Move down stay the only way to reorder from the keyboard. A
 * drag only ever adds a second route to the same `moveTo`.
 */
export function useBlockDrag(moveTo: (id: string, targetId: string, after: boolean) => void) {
  const [dragId, setDragId] = useState("");
  const [over, setOver] = useState<{ id: string; after: boolean } | null>(null);

  const stop = () => {
    setDragId("");
    setOver(null);
  };

  return {
    dragId,
    /** Which side of a row to draw the drop line on, if any. */
    edgeFor: (id: string): DropEdge =>
      !dragId || dragId === id || over?.id !== id ? null : over.after ? "bottom" : "top",

    start: (id: string) => (event: DragEvent) => {
      setDragId(id);
      event.dataTransfer.effectAllowed = "move";
      // Firefox starts no drag at all without payload on the transfer.
      event.dataTransfer.setData("text/plain", id);
    },

    over: (id: string) => (event: DragEvent<HTMLElement>) => {
      if (!dragId || dragId === id) return;
      event.preventDefault();
      const box = event.currentTarget.getBoundingClientRect();
      const after = event.clientY > box.top + box.height / 2;
      if (over?.id !== id || over.after !== after) setOver({ id, after });
    },

    drop: (id: string) => (event: DragEvent) => {
      event.preventDefault();
      if (dragId && dragId !== id) moveTo(dragId, id, over?.id === id ? over.after : false);
      stop();
    },

    end: stop,
  };
}
