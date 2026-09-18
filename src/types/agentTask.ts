/**
 * Background agent tasks — the Dexi runtime described in SETUP.md.
 *
 * Nothing here is confirmed. Probed on 2026-09-18, every runtime route
 * (`/tasks/{id}/steps`, `/memories`, `/models`) answers 404 "Route not found",
 * and no sample payload exists in either doc. So rows are read tolerantly
 * through `pickField`, and every normalised object keeps `raw` — the first
 * real response will show what the fields are actually called.
 */

/** A task row as the API might send it. Every field is a guess but `id`. */
export type AgentTaskRow = {
  id: number | string;
  agent_id?: number | string | null;
  user_id?: number | string | null;
  title?: string | null;
  goal?: string | null;
  status?: string | null;
  result?: string | null;
  error?: string | null;
  /** Where the task came from: "chat", "whatsapp", "telegram", "extension". */
  source?: string | null;
  /** Set on children of `spawn_subtask` (max depth 2, max 10 children). */
  parent_id?: number | string | null;
  steps_used?: number | null;
  step_budget?: number | null;
  schedule?: string | null;
  schedule_enabled?: boolean | number | null;
  next_run_at?: string | null;
  tokens_charged?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  finished_at?: string | null;
};

/**
 * Our own closed set, mapped from whatever the backend calls it, so views can
 * switch safely before the enum is confirmed. `statusRaw` keeps the original.
 */
export type TaskState =
  | "queued"
  | "running"
  | "paused"
  | "scheduled"
  | "done"
  | "failed"
  | "cancelled"
  | "unknown";

/** The task shape screens use. */
export type AgentTask = {
  id: string;
  agentId: string;
  title: string;
  /** The self-contained instructions the runtime works from. */
  goal: string;
  state: TaskState;
  /** The backend's own word, kept because the enum isn't confirmed. */
  statusRaw: string;
  result: string;
  error: string;
  source: string;
  parentId: string | null;
  stepsUsed: number;
  /** 150 by default, per SETUP.md. Null when the API doesn't report it. */
  stepBudget: number | null;
  /** A recurring task, toggled with POST /tasks/{id}/toggle. */
  scheduled: boolean;
  schedule: string;
  nextRunAt: string | null;
  tokensCharged: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  finishedAt: string | null;
  /** The untouched row. Drop this once the shape is known. */
  raw: Record<string, unknown>;
};

/** One entry in the activity log — the real version of the empty /actions. */
export type TaskStepRow = {
  id: number | string;
  task_id?: number | string | null;
  type?: string | null;
  tool?: string | null;
  input?: unknown;
  output?: unknown;
  error?: string | null;
  tokens?: number | null;
  created_at?: string | null;
};

export type TaskStep = {
  id: string;
  taskId: string;
  /** "thought", "tool_call", "result" — unknown until the route ships. */
  kind: string;
  tool: string;
  input: unknown;
  output: unknown;
  error: string;
  tokens: number | null;
  at: string | null;
  raw: Record<string, unknown>;
};

/** Body for POST /agents/{agentId}/tasks. `goal` carries the full context. */
export type AgentTaskInput = {
  goal: string;
  title?: string;
  schedule?: string;
  source?: string;
};
