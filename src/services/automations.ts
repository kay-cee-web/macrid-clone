import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList, pickOne, toBool, toNumber, toText } from "@/lib/api/pick";
import type { Automation, AutomationPatch } from "@/types/automation";

/**
 * An agent's scheduled tasks (confirmed 2026-10-20). The agent creates them
 * from chat (`schedule_automation`); these routes list, change, run and remove
 * them. There's no pause route: pausing is `PUT {is_active: false}`.
 */
const base = (agentId: string) => `/agents/${agentId}/automations`;

const normalize = (row: Record<string, unknown>): Automation => ({
  id: toText(row.id),
  agentId: toText(row.agent_id),
  name: toText(row.name) || "Untitled task",
  prompt: toText(row.prompt),
  scheduleType: toText(row.schedule_type),
  schedule: row.schedule && typeof row.schedule === "object" ? (row.schedule as Record<string, unknown>) : {},
  deliverTo: toText(row.deliver_to) || "none",
  active: toBool(row.is_active, true),
  nextRunAt: toText(row.next_run_at),
  lastRunAt: toText(row.last_run_at),
  runCount: toNumber(row.run_count),
  lastError: toText(row.last_error),
});

export async function fetchAutomations(agentId: string): Promise<Automation[]> {
  const { data } = await api.get(base(agentId));
  assertEnvelope(data, "Could not load the scheduled tasks");
  return pickList<Record<string, unknown>>(data, "automations").map(normalize);
}

/** Answers with the saved row, `next_run_at` recalculated when the schedule changed. */
export async function updateAutomation(agentId: string, id: string, patch: AutomationPatch): Promise<Automation> {
  const { data } = await api.put(`${base(agentId)}/${id}`, patch);
  assertEnvelope(data, "Could not update that task");
  return normalize(pickOne<Record<string, unknown>>(data, "automation"));
}

/**
 * Runs it once, now, and answers with the reply. The run is posted to the
 * agent's chat as a turn (the prompt, then the reply), so the result lives there.
 */
export async function runAutomation(agentId: string, id: string): Promise<string> {
  const { data } = await api.post(`${base(agentId)}/${id}/run`, {});
  assertEnvelope(data, "Could not run that task");
  return toText((data as Record<string, unknown>).reply);
}

export async function deleteAutomation(agentId: string, id: string): Promise<void> {
  const { data } = await api.delete(`${base(agentId)}/${id}`);
  assertEnvelope(data, "Could not delete that task");
}
