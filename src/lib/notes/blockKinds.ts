import {
  Code,
  FilePlus2,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Quote,
  Type,
  type LucideIcon,
} from "lucide-react";
import type { BlockType } from "@/types/noteBlock";

/** The block catalogue: what the "/" menu offers, and how each block is drawn. */
export type BlockKind = {
  type: BlockType;
  label: string;
  Icon: LucideIcon;
  group: BlockGroup;
  /** Shown in an empty block of this type. */
  placeholder: string;
  /** Extra words the "/" menu matches on, so "checkbox" finds To-do. */
  aliases?: string[];
};

export type BlockGroup = "Text" | "Lists" | "Content and media";
export const BLOCK_GROUPS: BlockGroup[] = ["Text", "Lists", "Content and media"];

export const BLOCK_KINDS: BlockKind[] = [
  { type: "text", label: "Text", Icon: Type, group: "Text", placeholder: "Type or press '/' to add elements", aliases: ["paragraph", "plain"] },
  { type: "h1", label: "Heading 1", Icon: Heading1, group: "Text", placeholder: "Heading 1", aliases: ["title", "h1"] },
  { type: "h2", label: "Heading 2", Icon: Heading2, group: "Text", placeholder: "Heading 2", aliases: ["h2"] },
  { type: "h3", label: "Heading 3", Icon: Heading3, group: "Text", placeholder: "Heading 3", aliases: ["h3"] },
  { type: "quote", label: "Quote", Icon: Quote, group: "Text", placeholder: "Quote", aliases: ["blockquote", "callout"] },
  { type: "divider", label: "Divider", Icon: Minus, group: "Text", placeholder: "", aliases: ["rule", "line", "separator", "hr"] },
  { type: "bullet", label: "Bulleted list", Icon: List, group: "Lists", placeholder: "List item", aliases: ["unordered", "ul"] },
  { type: "number", label: "Numbered list", Icon: ListOrdered, group: "Lists", placeholder: "List item", aliases: ["ordered", "ol"] },
  { type: "todo", label: "To-do", Icon: ListTodo, group: "Lists", placeholder: "To-do", aliases: ["task", "checkbox", "checklist"] },
  { type: "image", label: "Add image", Icon: ImageIcon, group: "Content and media", placeholder: "Paste an image URL", aliases: ["picture", "photo"] },
  { type: "code", label: "Code block", Icon: Code, group: "Content and media", placeholder: "Code", aliases: ["snippet", "pre"] },
];

const BY_TYPE = new Map(BLOCK_KINDS.map((kind) => [kind.type, kind]));

export const kindOf = (type: BlockType): BlockKind => BY_TYPE.get(type) ?? BLOCK_KINDS[0];

/** What the "/" menu shows for what's been typed after the slash. */
export function matchKinds(query: string): BlockKind[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return BLOCK_KINDS;
  return BLOCK_KINDS.filter((kind) =>
    [kind.label, ...(kind.aliases ?? [])].some((word) => word.toLowerCase().includes(needle)),
  );
}

/** A row of the "/" menu. Everything but "Add new note" inserts a block. */
export type SlashOption = {
  key: string;
  label: string;
  Icon: LucideIcon;
  group: string;
  /** Absent on the one option that isn't a block. */
  type?: BlockType;
};

const NEW_NOTE: SlashOption = { key: "new-note", label: "Add new note", Icon: FilePlus2, group: "Notes" };

export const SLASH_GROUPS = ["Notes", ...BLOCK_GROUPS];

export function slashOptions(query: string): SlashOption[] {
  const needle = query.trim().toLowerCase();
  const blocks = matchKinds(query).map((kind) => ({
    key: kind.type,
    label: kind.label,
    Icon: kind.Icon,
    group: kind.group as string,
    type: kind.type,
  }));
  return [...(NEW_NOTE.label.toLowerCase().includes(needle) ? [NEW_NOTE] : []), ...blocks];
}
