import type { Block, BlockType } from "@/types/noteBlock";

/**
 * Markdown in, blocks out, and back again.
 *
 * The pair has to round-trip: a note is read as markdown, edited as blocks and
 * written back as markdown, so anything `parseBlocks` understands
 * `serializeBlocks` must be able to write.
 */
let seq = 0;

export function newBlock(type: BlockType = "text", text = "", done = false): Block {
  seq += 1;
  return { id: `b${seq}`, type, text, done };
}

/** Line prefixes, longest first so `###` is never read as `#`. */
const PREFIXES: [BlockType, RegExp, string][] = [
  ["h3", /^###\s+/, "### "],
  ["h2", /^##\s+/, "## "],
  ["h1", /^#\s+/, "# "],
  ["quote", /^>\s?/, "> "],
  ["bullet", /^[-*+]\s+/, "- "],
];

const DIVIDER = /^\s*(-{3,}|_{3,}|\*{3,})\s*$/;
const IMAGE = /^!\[[^\]]*\]\(\s*([^)\s]+)[^)]*\)$/;
const TODO = /^\s*[-*+]\s+\[([ xX])\]\s*(.*)$/;
const NUMBER = /^\s*\d+[.)]\s+/;
const FENCE = /^\s*```/;

function fromLine(line: string): Block {
  const text = line.trimEnd();
  if (DIVIDER.test(text)) return newBlock("divider");
  const image = IMAGE.exec(text.trim());
  if (image) return newBlock("image", image[1]);
  const todo = TODO.exec(text);
  if (todo) return newBlock("todo", todo[2], todo[1].toLowerCase() === "x");
  if (NUMBER.test(text)) return newBlock("number", text.replace(NUMBER, ""));
  const prefix = PREFIXES.find(([, pattern]) => pattern.test(text));
  return prefix ? newBlock(prefix[0], text.replace(prefix[1], "")) : newBlock("text", text);
}

/** Always returns at least one block, so there is somewhere to type. */
export function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (!lines[i].trim()) continue;
    if (FENCE.test(lines[i])) {
      const code: string[] = [];
      for (i += 1; i < lines.length && !FENCE.test(lines[i]); i += 1) code.push(lines[i]);
      blocks.push(newBlock("code", code.join("\n")));
      continue;
    }
    blocks.push(fromLine(lines[i]));
  }
  return blocks.length ? blocks : [newBlock()];
}

const LISTS: BlockType[] = ["bullet", "number", "todo"];

function toLine(block: Block, index: number): string {
  switch (block.type) {
    case "divider":
      return "---";
    case "image":
      return `![](${block.text})`;
    case "code":
      return `\`\`\`\n${block.text}\n\`\`\``;
    case "todo":
      return `- [${block.done ? "x" : " "}] ${block.text}`;
    case "number":
      return `${index}. ${block.text}`;
    default:
      return `${PREFIXES.find(([type]) => type === block.type)?.[2] ?? ""}${block.text}`;
  }
}

/**
 * Empty text blocks are dropped: markdown has no blank paragraph, and an editor
 * full of places the caret has been shouldn't grow the file.
 */
export function serializeBlocks(blocks: Block[]): string {
  const kept = blocks.filter((block) => block.type !== "text" || block.text.trim());
  let run = 0;
  return kept
    .map((block, i) => {
      const prev = kept[i - 1];
      run = block.type === "number" && prev?.type === "number" ? run + 1 : 1;
      // Items of one list sit on consecutive lines; everything else needs a blank line.
      const gap = !prev ? "" : LISTS.includes(block.type) && prev.type === block.type ? "\n" : "\n\n";
      return gap + toLine(block, run);
    })
    .join("")
    .trim();
}

/** Markdown typed at the start of a block: "## " becomes a heading, "- " a bullet. */
const SHORTCUTS: [RegExp, BlockType][] = [
  [/^###\s/, "h3"],
  [/^##\s/, "h2"],
  [/^#\s/, "h1"],
  [/^>\s/, "quote"],
  [/^[-*]\s\[[ xX]?\]\s?/, "todo"],
  [/^\[[ xX]?\]\s/, "todo"],
  [/^[-*]\s/, "bullet"],
  [/^\d+[.)]\s/, "number"],
  [/^```/, "code"],
  [/^(-{3}|\*{3})$/, "divider"],
];

export function shortcutFor(text: string): { type: BlockType; text: string } | null {
  const hit = SHORTCUTS.find(([pattern]) => pattern.test(text));
  return hit ? { type: hit[1], text: text.replace(hit[0], "") } : null;
}
