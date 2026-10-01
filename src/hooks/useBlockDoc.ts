"use client";

import { useState } from "react";
import { newBlock, parseBlocks, serializeBlocks } from "@/lib/notes/blocks";
import type { Block, BlockType } from "@/types/noteBlock";

/**
 * Which block to put the caret in. `tick` moves even when the id doesn't, so the
 * same block can be re-focused; `caret` is where in it, -1 meaning the end.
 */
type Focus = { id: string; tick: number; caret: number };

/**
 * The open note as blocks, and every way the editor changes them.
 *
 * Seeded once from the markdown it's given: the caller remounts this with
 * `key={note.id}`, because syncing a prop into state in an effect is both
 * forbidden here and a good way to lose what someone is halfway through typing.
 *
 * `onChange` is handed the serialized markdown by every change, rather than the
 * caller watching `markdown` in an effect — the value it needs is already in
 * hand at that point, and a save shouldn't have to wait a render to be told.
 */
export function useBlockDoc(initial: string, onChange: (markdown: string) => void) {
  const [blocks, setBlocks] = useState(() => parseBlocks(initial));
  // An empty note opens with the caret in it — there is nothing to read, so the
  // only thing to do is write. A note with a body is left alone to be read.
  const [focus, setFocus] = useState<Focus>(() => ({
    id: initial.trim() ? "" : blocks[0].id,
    tick: 1,
    caret: -1,
  }));

  const indexOf = (id: string) => blocks.findIndex((block) => block.id === id);
  const focusOn = (id: string, caret = -1) => setFocus((at) => ({ id, caret, tick: at.tick + 1 }));

  /** Never leave the note with nothing to type into. */
  const commit = (next: Block[], focusId?: string, caret = -1) => {
    const list = next.length ? next : [newBlock()];
    setBlocks(list);
    if (!next.length) focusOn(list[0].id);
    else if (focusId) focusOn(focusId, caret);
    onChange(serializeBlocks(list));
  };

  const update = (id: string, patch: Partial<Block>) =>
    commit(blocks.map((block) => (block.id === id ? { ...block, ...patch } : block)));

  /** Enter, and the "+" in the gutter. A new line inherits the kind it came from, the way a list does. */
  const insertAfter = (id: string, type: BlockType = "text") => {
    const block = newBlock(type);
    const next = [...blocks];
    next.splice(indexOf(id) + 1 || next.length, 0, block);
    commit(next, block.id);
    return block.id;
  };

  /** A "/" pick or a markdown shortcut. A divider has nothing to type in, so it gets a line after it. */
  const convert = (id: string, type: BlockType, text?: string) => {
    const at = indexOf(id);
    if (at < 0) return;
    const next = [...blocks];
    next[at] = { ...next[at], type, text: text ?? next[at].text, done: false };
    if (type !== "divider") return commit(next, id);
    const after = next[at + 1] ?? newBlock();
    if (!next[at + 1]) next.push(after);
    commit(next, after.id);
  };

  const duplicate = (id: string) => {
    const at = indexOf(id);
    if (at < 0) return;
    const copy = newBlock(blocks[at].type, blocks[at].text, blocks[at].done);
    const next = [...blocks];
    next.splice(at + 1, 0, copy);
    commit(next, copy.id);
  };

  const remove = (id: string) => {
    const at = indexOf(id);
    if (at < 0) return;
    commit(
      blocks.filter((block) => block.id !== id),
      blocks[at - 1]?.id ?? blocks[at + 1]?.id,
    );
  };

  const move = (id: string, delta: number) => {
    const at = indexOf(id);
    const to = at + delta;
    if (at < 0 || to < 0 || to >= blocks.length) return;
    const next = [...blocks];
    [next[at], next[to]] = [next[to], next[at]];
    commit(next, id);
  };

  /** Where a drag lands: the block goes above or below the one it was dropped on. */
  const moveTo = (id: string, targetId: string, after: boolean) => {
    const from = indexOf(id);
    if (from < 0 || id === targetId) return;
    const rest = blocks.filter((block) => block.id !== id);
    const target = rest.findIndex((block) => block.id === targetId);
    if (target < 0) return;
    rest.splice(target + (after ? 1 : 0), 0, blocks[from]);
    commit(rest, id);
  };

  /**
   * Backspace with the caret at the start: lose the formatting first, then the
   * block. Deleting a heading on the first press would throw away the words in
   * it, which is never what the key was pressed for.
   */
  const backspace = (id: string) => {
    const at = indexOf(id);
    const block = blocks[at];
    if (!block) return;
    if (block.type !== "text") return convert(id, "text");
    const prev = blocks[at - 1];
    if (!prev || prev.type === "divider" || prev.type === "image") return;
    const next = blocks.filter((item) => item.id !== id);
    next[at - 1] = { ...prev, text: prev.text + block.text };
    // The caret lands where the two blocks were joined, not at the end.
    commit(next, prev.id, prev.text.length);
  };

  return {
    blocks,
    focus,
    update,
    insertAfter,
    convert,
    duplicate,
    remove,
    move,
    moveTo,
    backspace,
    focusOn,
  };
}
