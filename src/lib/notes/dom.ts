/**
 * Caret and selection, in characters rather than DOM nodes.
 *
 * A contenteditable block holds elements — `<strong>`, `<a>`, a colour span — so
 * "where is the caret" is a node and an offset inside it. Everything else in the
 * editor thinks in character positions, and this is the translation.
 */
function offsetOf(root: HTMLElement, container: Node, offset: number): number {
  const range = document.createRange();
  range.selectNodeContents(root);
  range.setEnd(container, offset);
  return range.toString().length;
}

export function caretRange(root: HTMLElement): { start: number; end: number } | null {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return null;
  const range = selection.getRangeAt(0);
  if (!root.contains(range.commonAncestorContainer)) return null;
  return {
    start: offsetOf(root, range.startContainer, range.startOffset),
    end: offsetOf(root, range.endContainer, range.endOffset),
  };
}

/** The node and offset a character position lands on, walking the block's text. */
function pointAt(root: HTMLElement, target: number): { node: Node; offset: number } {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let seen = 0;
  let node = walker.nextNode();
  while (node) {
    const length = node.textContent?.length ?? 0;
    if (seen + length >= target) return { node, offset: target - seen };
    seen += length;
    node = walker.nextNode();
  }
  return { node: root, offset: root.childNodes.length };
}

export function setCaret(root: HTMLElement, start: number, end = start) {
  const range = document.createRange();
  const from = pointAt(root, start);
  const to = pointAt(root, end);
  range.setStart(from.node, from.offset);
  range.setEnd(to.node, to.offset);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

/**
 * The caret at the very end of the block, outside whatever mark ends it.
 *
 * `setCaret` walks to the last text node, which for a line ending in bold is
 * *inside* the `<strong>` — so everything typed next would join it. A position
 * after the element isn't enough either: a caret there is ambiguous, and the
 * browser resolves it back into the element. A zero-width character to sit in
 * is the thing that actually breaks out. It is invisible, and `htmlToInline`
 * drops it, so it never reaches the note.
 */
export function setCaretAfterEnd(root: HTMLElement) {
  const spacer = document.createTextNode("​");
  root.append(spacer);
  const range = document.createRange();
  range.setStart(spacer, 1);
  range.collapse(true);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

/** Where the selection starts, in the coordinates of the block's positioned parent. */
export function selectionPoint(root: HTMLElement): { x: number; y: number } | null {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return null;
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  const box = root.getBoundingClientRect();
  return { x: rect.left - box.left + root.offsetLeft, y: rect.top - box.top + root.offsetTop };
}

/** The editable block a node sits in, if any. */
export function fieldOf(node: Node | null): HTMLElement | null {
  const element = node instanceof Element ? node : node?.parentElement;
  return element?.closest<HTMLElement>("[data-block]") ?? null;
}

/** Programmatic DOM edits are invisible to React until an input event says so. */
export function announceInput(field: HTMLElement) {
  field.dispatchEvent(new InputEvent("input", { bubbles: true }));
}
