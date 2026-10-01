/**
 * A note's body is markdown on the wire (`content`); blocks are how the editor
 * holds it while it's being written.
 *
 * One block is one markdown construct — a paragraph, a heading, a list item — so
 * the document round-trips through `parseBlocks`/`serializeBlocks` and the
 * backend never has to know the editor exists. A note written in the block
 * editor is still readable by anything that reads markdown, and a meeting
 * write-up the agent files arrives as blocks without being converted.
 */
export type BlockType =
  | "text"
  | "h1"
  | "h2"
  | "h3"
  | "quote"
  | "divider"
  | "bullet"
  | "number"
  | "todo"
  | "code"
  | "image";

export type Block = {
  /** Editor-only, for React keys and focus. Never stored. */
  id: string;
  type: BlockType;
  /** The block's own text: the URL for `image`, empty for `divider`. */
  text: string;
  /** `todo` only — whether it's ticked. */
  done: boolean;
};
