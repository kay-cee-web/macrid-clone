"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type SyntheticEvent } from "react";
import { caretRange, setCaret, setCaretAfterEnd } from "@/lib/notes/dom";
import { escapeHtml, htmlToInline, inlineToHtml } from "@/lib/notes/inline";
import { cn } from "@/lib/cn";

/**
 * Markdown finished at the caret: the closing `**`, `~~` or `*` of a run, or the
 * `)` that ends a link. The lookbehind is what stops the first `*` of a `**`
 * pair being read as the end of an emphasis.
 */
const FINISHED = [/(?<![*~])(\*\*|~~|\*)([^*~\n]+)\1$/, /\[([^\]\n]*)\]\(([^)\s]*)\)$/];

/**
 * Turn markdown into the thing it means, as it is typed.
 *
 * Two conditions, and both matter. The caret must be at the end of the block,
 * because redrawing mid-sentence would have to map a caret position from the
 * markdown onto the rendered text. And the markers must still be *on screen* —
 * once the run is drawn as bold they are gone from the text, so the pattern
 * stops matching and the block is left alone. Without that second test every
 * later keystroke would redraw the line, eating the spaces after it.
 */
function autoFormat(field: HTMLElement, text: string) {
  const range = caretRange(field);
  const shown = field.textContent ?? "";
  if (!range || range.start !== range.end || range.start !== shown.length) return;
  if (!FINISHED.some((pattern) => pattern.test(text) && pattern.test(shown))) return;

  field.innerHTML = inlineToHtml(text);
  // Outside the mark, so the next word isn't bold too.
  setCaretAfterEnd(field);
}

type BlockTextProps = {
  blockId: string;
  value: string;
  placeholder: string;
  label: string;
  /** Non-zero takes the caret; it changes on every request, so the same block can be re-focused. */
  focusKey: number;
  /** Where in the text to put the caret, -1 for the end. */
  caret: number;
  /** Code keeps its markers and its newlines; every other block is drawn, not spelled out. */
  plain?: boolean;
  className?: string;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onSelect: (event: SyntheticEvent<HTMLElement>) => void;
};

/**
 * One block's text, shown the way it will read: bold is bold, a link is a link,
 * a colour is the colour. The markdown behind it is what gets stored — this
 * element is the only place in the app that holds the rendered form.
 *
 * It is deliberately uncontrolled. React writes the HTML once, on mount, and
 * after that the element owns it: re-rendering a contenteditable on every
 * keystroke would put the caret back at the start of the line each time. The
 * effect below steps in only when the text changed somewhere other than here —
 * a type conversion, a drag, a toolbar press that rewrote the markdown.
 */
export function BlockText({ blockId, value, plain, className, ...on }: BlockTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const written = useRef(value);
  const draw = (text: string) => (plain ? escapeHtml(text) : inlineToHtml(text));
  const [initial] = useState(() => draw(value));

  useEffect(() => {
    const field = ref.current;
    if (!field || value === written.current) return;
    field.innerHTML = draw(value);
    written.current = value;
    // `draw` is rebuilt every render and reads only `plain`, which is in the deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, plain]);

  useEffect(() => {
    const field = ref.current;
    if (!on.focusKey || !field) return;
    field.focus();
    const length = field.textContent?.length ?? 0;
    setCaret(field, on.caret < 0 ? length : Math.min(on.caret, length));
  }, [on.focusKey, on.caret]);

  const read = () => {
    const field = ref.current;
    if (!field) return;
    const next = plain ? field.innerText : htmlToInline(field);
    written.current = next;
    on.onChange(next);
    if (!plain) autoFormat(field, next);
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label={on.label}
      aria-multiline={plain || undefined}
      data-block={blockId}
      data-empty={value ? undefined : ""}
      data-placeholder={on.placeholder}
      onInput={read}
      onKeyDown={on.onKeyDown}
      onSelect={on.onSelect}
      onMouseUp={on.onSelect}
      onKeyUp={on.onSelect}
      dangerouslySetInnerHTML={{ __html: initial }}
      className={cn(
        "relative w-full wrap-anywhere text-ink outline-none",
        plain && "whitespace-pre-wrap",
        // The hint belongs to the line you're on. Every empty block saying it at
        // once reads as a form to fill in rather than a page to write on.
        "before:pointer-events-none before:absolute before:text-faint",
        "data-empty:focus:before:content-[attr(data-placeholder)]",
        "[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2",
        className,
      )}
    />
  );
}
