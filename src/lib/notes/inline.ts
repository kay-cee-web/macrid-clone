/**
 * Inline markdown in, rendered HTML out, and back again.
 *
 * This is what lets the editor show bold as bold while still storing `**bold**`:
 * the block's text stays markdown everywhere outside the one contenteditable
 * element that draws it.
 *
 * Colour is the single exception. Markdown has no way to say it, so it is kept
 * as the HTML every markdown writer uses for it — a span with a colour — and
 * read back out again here.
 */
const COLOR_SPAN = /&lt;span style="color:(#[0-9a-fA-F]{3,8})"&gt;([\s\S]*?)&lt;\/span&gt;/g;

export function inlineToHtml(text: string): string {
  return escapeHtml(text)
    .replace(COLOR_SPAN, '<span style="color:$1">$2</span>')
    .replace(/\[([^\]]*)\]\(([^)\s]*)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>");
}

export function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** The tags a browser produces for each mark, and the markdown that means the same. */
const WRAPS: Record<string, string> = {
  B: "**",
  STRONG: "**",
  I: "*",
  EM: "*",
  S: "~~",
  STRIKE: "~~",
  DEL: "~~",
};

function fromNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const element = node as HTMLElement;
  // A block holds one line; a break pasted into it becomes a space rather than
  // splitting the markdown into something `parseBlocks` would read as two.
  if (element.tagName === "BR") return " ";

  const inner = Array.from(element.childNodes).map(fromNode).join("");
  if (!inner) return "";
  if (element.tagName === "A") return `[${inner}](${element.getAttribute("href") ?? ""})`;

  // Our own marks arrive as tags; pasted text can arrive as styles instead.
  const marked = WRAPS[element.tagName]
    ? `${WRAPS[element.tagName]}${inner}${WRAPS[element.tagName]}`
    : styled(element, inner);

  const color = hexOf(element.style.color || element.getAttribute("color") || "");
  return color ? `<span style="color:${color}">${marked}</span>` : marked;
}

function styled(element: HTMLElement, inner: string): string {
  const { fontWeight, fontStyle, textDecorationLine } = element.style;
  const bold = /^(bold|[6-9]00)$/.test(fontWeight) ? `**${inner}**` : inner;
  const italic = fontStyle === "italic" ? `*${bold}*` : bold;
  return textDecorationLine.includes("line-through") ? `~~${italic}~~` : italic;
}

/**
 * What the user has typed, as markdown. Non-breaking spaces come back as
 * ordinary ones, and the zero-width characters the editor uses to get the caret
 * out of a mark are dropped — they belong to the DOM, not to the note.
 */
export function htmlToInline(root: HTMLElement): string {
  return Array.from(root.childNodes)
    .map(fromNode)
    .join("")
    .replace(/ /g, " ")
    .replace(/​/g, "");
}

/** Markdown with its marks taken off, for a list row or a derived title. */
export function inlineToText(text: string): string {
  return text
    .replace(/<span style="color:#[0-9a-fA-F]{3,8}">([\s\S]*?)<\/span>/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/```/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+(\[[ xX]\]\s*)?/gm, "")
    .replace(/\*\*|~~|`/g, "")
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1$2")
    .trim();
}

/** Browsers answer `rgb(…)` for a colour they were given as hex. */
export function hexOf(value: string): string {
  const text = value.trim();
  if (/^#[0-9a-f]{3,8}$/i.test(text)) return text.toLowerCase();
  const rgb = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/i.exec(text);
  if (!rgb) return "";
  return `#${[1, 2, 3].map((part) => Number(rgb[part]).toString(16).padStart(2, "0")).join("")}`;
}
