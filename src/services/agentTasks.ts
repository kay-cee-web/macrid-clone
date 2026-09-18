import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { normalizeStep, normalizeTask, toTaskPayload } from "@/lib/tasks/normalize";
import { pickList, pickOne } from "@/lib/api/pick";
import type { AgentTask, AgentTaskInput, AgentTaskRow, TaskStep, TaskStepRow } from "@/types/agentTask";

/**
 * Background agent tasks — the Dexi runtime (SETUP.md §4).
 *
 * NOT LIVE YET. Probed 2026-09-18: `/tasks/{id}/steps` and the rest answer
 * 404 "Route not found", so nothing in the app calls this file. It exists so
 * that the first thing we can do when the routes ship is make a real call and
 * read the shapes off `raw`.
 *
 * `TASKS` is provisional. `/tasks` and `/tasks/{id}` already belong to the CRM
 * tasks resource (see `services/tasks.ts`), so the two collide and the backend
 * has to move one of them. When they pick a prefix, change this line only.
 */
const TASKS = "/tasks";

/** Creating a task is nested under its agent, so it never collided. */
const agentTasks = (agentId: string) => `/agents/${agentId}/tasks`;

/** The API's own wording for an action, when it sends one. */
const messageOf = (data: unknown) => {
  const text = (data as { message?: unknown })?.message;
  return typeof text === "string" ? text : "";
};

/** A row when the response carries one, rather than a bare acknowledgement. */
const maybeTask = (data: unknown): AgentTask | null => {
  const row = (data as Record<string, unknown>)?.task;
  return row && typeof row === "object" && !Array.isArray(row)
    ? normalizeTask(row as AgentTaskRow)
    : null;
};

/** Every task for the account. Pagination is unconfirmed. */
export async function fetchTasks(): Promise<AgentTask[]> {
  const { data } = await api.get(TASKS);
  assertEnvelope(data, "Could not load your tasks");
  return pickList<AgentTaskRow>(data, "tasks").map(normalizeTask);
}

export async function fetchTask(taskId: string): Promise<AgentTask> {
  const { data } = await api.get(`${TASKS}/${taskId}`);
  assertEnvelope(data, "Could not load that task");
  return normalizeTask(pickOne<AgentTaskRow>(data, "task"));
}

/**
 * Hand a job to the runtime. `goal` must be self-contained: the queue worker
 * has none of the chat's context.
 */
export async function startTask(agentId: string, input: AgentTaskInput): Promise<AgentTask> {
  const { data } = await api.post(agentTasks(agentId), toTaskPayload(input));
  assertEnvelope(data, "Could not start the task");
  return normalizeTask(pickOne<AgentTaskRow>(data, "task"));
}

/**
 * The activity log, and the only way to follow a run: there is no streaming,
 * so poll with `after` set to the last step's id, the way channel pairing does.
 */
export async function fetchTaskSteps(taskId: string, after?: string): Promise<TaskStep[]> {
  const { data } = await api.get(`${TASKS}/${taskId}/steps`, {
    params: after ? { after } : undefined,
  });
  assertEnvelope(data, "Could not load the task's steps");
  return pickList<TaskStepRow>(data, "steps").map(normalizeStep);
}

/** Stop a running task. It keeps the steps it has already taken. */
export async function cancelTask(taskId: string) {
  const { data } = await api.post(`${TASKS}/${taskId}/cancel`);
  assertEnvelope(data, "Could not cancel the task");
  return { task: maybeTask(data), message: messageOf(data) };
}

/** Re-run a failed task from the start. */
export async function retryTask(taskId: string) {
  const { data } = await api.post(`${TASKS}/${taskId}/retry`);
  assertEnvelope(data, "Could not retry the task");
  return { task: maybeTask(data), message: messageOf(data) };
}

export async function deleteTask(taskId: string): Promise<void> {
  const { data } = await api.delete(`${TASKS}/${taskId}`);
  assertEnvelope(data, "Could not delete the task");
}

/**
 * Turn a recurring task's schedule on or off. Whether it takes a body or just
 * flips the flag is unconfirmed, so nothing is sent until we can test it.
 */
export async function toggleTaskSchedule(taskId: string) {
  const { data } = await api.post(`${TASKS}/${taskId}/toggle`);
  assertEnvelope(data, "Could not change the schedule");
  return { task: maybeTask(data), message: messageOf(data) };
}

/** Fire a scheduled task now, without waiting for its next tick. */
export async function runTaskNow(taskId: string) {
  const { data } = await api.post(`${TASKS}/${taskId}/run-now`);
  assertEnvelope(data, "Could not run the task");
  return { task: maybeTask(data), message: messageOf(data) };
}
