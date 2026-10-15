import { announceInput, fieldOf } from "./dom";

/**
 * Emoji reactions on a highlighted run of a note.
 *
 * Notes have no reactions route, so a reaction lives in the note itself, the
 * way a colour does: `<mark data-r="👍,❤️">the text</mark>`. It is saved with
 * the note, survives a reload, and the run stays highlighted so it's clear what
 * was reacted to. Commas separate them because an emoji can be several code
 * points long. One person writes a note, so each reaction counts once.
 */
export const REACTIONS = ["👍", "➕", "❤️", "🎉", "👀", "😄", "🚀", "✅"];

export type Reaction = { index: number; emojis: string[] };

const MARK = /<mark data-r="([^"<>]*)">/g;

export const splitEmojis = (value: string | undefined) => (value ?? "").split(",").filter(Boolean);

/** Every reacted run in a block's markdown, in order. */
export function reactionsIn(text: string): Reaction[] {
  // Counted after dropping empty ones, the same way `removeReaction` counts the DOM's.
  return Array.from(text.matchAll(MARK), (match) => splitEmojis(match[1]))
    .filter((emojis) => emojis.length > 0)
    .map((emojis, index) => ({ index, emojis }));
}

const marksOf = (blockId: string) =>
  Array.from(document.querySelectorAll<HTMLElement>(`[data-block="${blockId}"] mark[data-r]`));

function unwrap(mark: HTMLElement) {
  mark.replaceWith(...Array.from(mark.childNodes));
}

/**
 * Reacts to the highlighted run. Inside a run that already has reactions, the
 * emoji joins them; otherwise the run is wrapped in a new mark, folding in any
 * marks it overlapped so they never nest.
 */
export function addReaction(emoji: string) {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return;
  const range = selection.getRangeAt(0);
  const field = fieldOf(range.commonAncestorContainer);
  if (!field) return;

  const start = range.startContainer;
  const inside = (start instanceof Element ? start : start.parentElement)?.closest<HTMLElement>("mark[data-r]");
  if (inside && field.contains(inside)) {
    const emojis = splitEmojis(inside.dataset.r);
    if (!emojis.includes(emoji)) inside.dataset.r = [...emojis, emoji].join(",");
  } else if (!range.collapsed) {
    const mark = document.createElement("mark");
    mark.append(range.extractContents());
    const merged = new Set<string>();
    mark.querySelectorAll<HTMLElement>("mark[data-r]").forEach((old) => {
      splitEmojis(old.dataset.r).forEach((e) => merged.add(e));
      unwrap(old);
    });
    merged.add(emoji);
    mark.dataset.r = Array.from(merged).join(",");
    range.insertNode(mark);
  }
  announceInput(field);
}

/** Takes one emoji off a run; the run loses its highlight with its last one. */
export function removeReaction(blockId: string, index: number, emoji: string) {
  const mark = marksOf(blockId).filter((m) => splitEmojis(m.dataset.r).length > 0)[index];
  const field = mark && fieldOf(mark);
  if (!mark || !field) return;

  const left = splitEmojis(mark.dataset.r).filter((e) => e !== emoji);
  if (left.length) mark.dataset.r = left.join(",");
  else unwrap(mark);
  announceInput(field);
}

/** Points at the run a reaction belongs to while the pointer is on the reaction. */
export function spotlight(blockId: string, index: number, on: boolean) {
  marksOf(blockId)
    .filter((m) => splitEmojis(m.dataset.r).length > 0)
    [index]?.toggleAttribute("data-active", on);
}
