import type { LucideIcon } from "lucide-react";

/** A thing to ask next in chat. `label` is what the row says; `text` is what picking it sends. */
export type Suggestion = { label: string; text: string; Icon: LucideIcon };
