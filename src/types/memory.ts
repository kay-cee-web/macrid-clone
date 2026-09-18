/**
 * Agent memory — `remember` / `recall` / `forget` and the self-written skills
 * from `save_skill` / `use_skill` (SETUP.md, OpenClaw parity table).
 *
 * `GET /memories` 404s on the live API as of 2026-09-18, so the field names
 * below are guesses and each row keeps `raw`, the same as `types/agentTask.ts`.
 */

/** Facts the agent recalls, and skills it wrote for itself. */
export type MemoryKind = "fact" | "skill";

export type MemoryRow = {
  id: number | string;
  user_id?: number | string | null;
  agent_id?: number | string | null;
  kind?: string | null;
  key?: string | null;
  value?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Memory = {
  id: string;
  kind: MemoryKind;
  /** What it's filed under: the fact's key, or the skill's name. */
  label: string;
  /** The remembered text, or the skill's steps. */
  value: string;
  /** Null when the memory belongs to the account rather than one agent. */
  agentId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  /** The untouched row. Drop this once the shape is known. */
  raw: Record<string, unknown>;
};

/** Body for POST /memories. */
export type MemoryInput = {
  kind: MemoryKind;
  label?: string;
  value: string;
  agentId?: string;
};
