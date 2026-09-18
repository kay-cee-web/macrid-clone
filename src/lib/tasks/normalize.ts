import { pickField, toBool, toMaybeNumber, toNumber, toText } from "@/lib/api/pick";
import type { AgentTask, AgentTaskInput, AgentTaskRow, TaskState, TaskStep, TaskStepRow } from "@/types/agentTask";

/**
 * Tolerant readers for the background-task rows. The routes aren't deployed
 * yet, so each field is looked up under every name it plausibly ships with and
 * the untouched row is kept as `raw`. Once a real response lands, trim the
 * candidate lists down to what the API actually sends.
 */

/** Whatever word the backend uses, mapped onto our own closed set. */
const STATES: Record<string, TaskState> = {
  queued: "queued",
  pending: "queued",
  waiting: "queued",
  running: "running",
  in_progress: "running",
  processing: "running",
  paused: "paused",
  sleeping: "paused",
  scheduled: "scheduled",
  done: "done",
  complete: "done",
  completed: "done",
  finished: "done",
  success: "done",
  failed: "failed",
  error: "failed",
  cancelled: "cancelled",
  canceled: "cancelled",
  stopped: "cancelled",
};

export const taskState = (value: unknown): TaskState =>
  STATES[toText(value).toLowerCase()] ?? "unknown";

/** A task is still moving, so its steps are worth polling. */
export const isTaskLive = (task: AgentTask) =>
  task.state === "queued" || task.state === "running" || task.state === "paused";

export function normalizeTask(row: AgentTaskRow): AgentTask {
  const raw = (row ?? {}) as unknown as Record<string, unknown>;
  const statusRaw = toText(pickField(raw, ["status", "state"]));
  return {
    // IDs come as numbers but are used as URL segments and React keys.
    id: String(raw.id ?? ""),
    agentId: toText(pickField(raw, ["agent_id", "agentId", "macrid_agent_id"])),
    title: toText(pickField(raw, ["title", "name"])) || "Untitled task",
    goal: toText(pickField(raw, ["goal", "instructions", "prompt"])),
    state: taskState(statusRaw),
    statusRaw,
    result: toText(pickField(raw, ["result", "summary", "output"])),
    error: toText(pickField(raw, ["error", "error_message", "failure_reason"])),
    source: toText(pickField(raw, ["source", "channel"])),
    parentId: toText(pickField(raw, ["parent_id", "parent_task_id"])) || null,
    // Not `steps`: that key may well be the step rows themselves, not a count.
    stepsUsed: toNumber(pickField(raw, ["steps_used", "step_count", "steps_completed"])),
    stepBudget: toMaybeNumber(pickField(raw, ["step_budget", "max_steps", "budget"])),
    scheduled: toBool(pickField(raw, ["schedule_enabled", "is_scheduled", "recurring"]), false),
    schedule: toText(pickField(raw, ["schedule", "cron", "frequency"])),
    nextRunAt: toText(pickField(raw, ["next_run_at", "scheduled_at"])) || null,
    tokensCharged: toMaybeNumber(pickField(raw, ["tokens_charged", "tokens"])),
    createdAt: toText(raw.created_at) || null,
    updatedAt: toText(raw.updated_at) || toText(raw.created_at) || null,
    finishedAt: toText(pickField(raw, ["finished_at", "completed_at", "ended_at"])) || null,
    raw,
  };
}

export function normalizeStep(row: TaskStepRow): TaskStep {
  const raw = (row ?? {}) as unknown as Record<string, unknown>;
  return {
    id: String(raw.id ?? ""),
    taskId: toText(pickField(raw, ["task_id", "dexi_task_id"])),
    kind: toText(pickField(raw, ["type", "kind", "role"])) || "step",
    tool: toText(pickField(raw, ["tool", "tool_name", "name"])),
    input: pickField(raw, ["input", "args", "arguments", "params"]) ?? null,
    output: pickField(raw, ["output", "result", "response"]) ?? null,
    error: toText(pickField(raw, ["error", "error_message"])),
    tokens: toMaybeNumber(pickField(raw, ["tokens", "tokens_charged"])),
    at: toText(raw.created_at) || null,
    raw,
  };
}

/** Allowlist of writable fields, so derived UI fields never reach the API. */
export function toTaskPayload(input: AgentTaskInput) {
  const payload: Record<string, unknown> = { goal: input.goal };
  if (input.title !== undefined) payload.title = input.title;
  if (input.schedule !== undefined) payload.schedule = input.schedule;
  if (input.source !== undefined) payload.source = input.source;
  return payload;
}
