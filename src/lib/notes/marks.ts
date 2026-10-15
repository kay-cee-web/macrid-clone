import { announceInput, fieldOf, setCaret } from "./dom";

/**
 * The toolbar's buttons, applied to whatever is highlighted.
 *
 * These go through `execCommand`. It is deprecated and every browser still
 * implements it, and it is the only thing that edits a contenteditable
 * selection — splitting a range across `<strong>` boundaries by hand is a
 * rewrite of the browser's own code, with its own bugs. What it produces is
 * read straight back out as markdown, so nothing of it is stored.
 */
/**
 * `styleWithCSS` decides what the browser writes: with it on, bold becomes a
 * span with a font-weight, and with it off, a `<b>`. Marks want the tag, which
 * is what markdown has a word for. Colour wants the style, because there is no
 * tag for it.
 */
function run(command: string, value?: string, css = false) {
  document.execCommand("styleWithCSS", false, css ? "true" : "false");
  document.execCommand(command, false, value);
}

export type Mark = "bold" | "italic" | "underline" | "strikeThrough";

export function applyMark(mark: Mark) {
  run(mark);
}

/**
 * Inline code, on or off. There is no `execCommand` for it, so the run is
 * wrapped in a `<code>` by hand — or, when the selection is already inside one,
 * the `<code>` is unwrapped — and the block is told its DOM changed.
 */
export function toggleInlineCode() {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return;
  const range = selection.getRangeAt(0);
  const field = fieldOf(range.commonAncestorContainer);
  if (!field) return;

  const start = range.startContainer;
  const inside = (start instanceof Element ? start : start.parentElement)?.closest("code");
  if (inside && field.contains(inside)) {
    inside.replaceWith(...Array.from(inside.childNodes));
  } else if (!range.collapsed) {
    const code = document.createElement("code");
    code.textContent = range.toString();
    range.deleteContents();
    range.insertNode(code);
  }
  announceInput(field);
}

export function applyLink(href: string) {
  if (href.trim()) run("createLink", href.trim());
}

/**
 * A colour, or none.
 *
 * "Default" can't be an `execCommand`, because the only way to say "no colour"
 * to it is to name one — and a named colour is wrong in the other theme. So the
 * spans the selection touches have their colour removed instead, and the block
 * is told its DOM changed.
 */
export function applyColor(hex: string) {
  if (hex) return run("foreColor", hex, true);

  const selection = window.getSelection();
  if (!selection?.rangeCount) return;
  const range = selection.getRangeAt(0);
  const field = fieldOf(range.commonAncestorContainer);
  if (!field) return;

  field.querySelectorAll<HTMLElement>("[style*='color']").forEach((span) => {
    if (range.intersectsNode(span)) span.style.removeProperty("color");
  });
  announceInput(field);
}

/** Put a selection back after the toolbar has taken the focus, e.g. to type a link. */
export function reselect(blockId: string, start: number, end: number) {
  const field = document.querySelector<HTMLElement>(`[data-block="${blockId}"]`);
  if (!field) return null;
  field.focus();
  setCaret(field, start, end);
  return field;
}
