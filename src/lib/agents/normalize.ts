import type { Agent, AgentInput, AgentRow, AgentStats } from "@/types/agent";

/** Laravel booleans arrive as true/false or 1/0. */
export const toBool = (value: unknown, fallback: boolean) =>
  value === undefined || value === null ? fallback : [true, 1, "1", "true"].includes(value as never);

const toNumber = (value: unknown) => (Number.isFinite(Number(value)) ? Number(value) : 0);

export function normalizeAgent(row: AgentRow): Agent {
  return {
    // IDs come as numbers but are used as URL segments and keys.
    id: String(row.id ?? ""),
    name: row.name?.trim() || "Untitled agent",
    instructions: row.instructions ?? "",
    model: row.model ?? null,
    isActive: toBool(row.is_active, true),
    // The backend defaults sending to on.
    sendingEnabled: toBool(row.sending_enabled, true),
    category: row.category ?? "",
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? row.created_at ?? null,
  };
}

/** Allowlist of writable fields, so derived UI fields never reach the API. */
export function toAgentPayload(input: AgentInput) {
  const payload: Record<string, unknown> = {};
  if (input.name !== undefined) payload.name = input.name;
  if (input.instructions !== undefined) payload.instructions = input.instructions;
  if (input.model !== undefined) payload.model = input.model;
  if (input.isActive !== undefined) payload.is_active = input.isActive;
  if (input.sendingEnabled !== undefined) payload.sending_enabled = input.sendingEnabled;
  return payload;
}

export function normalizeStats(raw: unknown): AgentStats | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  return {
    messages: toNumber(s.messages),
    actionsTotal: toNumber(s.actions_total),
    sentLast24h: toNumber(s.sent_last_24h),
    blockedLast24h: toNumber(s.blocked_last_24h),
    lastActionAt: typeof s.last_action_at === "string" ? s.last_action_at : null,
  };
}

/** The first array found among the usual envelope keys. */
export function pickList<T>(data: unknown, key: string): T[] {
  const d = data as Record<string, unknown> | undefined;
  const nested = d?.data as Record<string, unknown> | undefined;
  const found = [d?.[key], nested?.[key], d?.data, data].find(Array.isArray);
  return (found as T[] | undefined) ?? [];
}

/** The single row out of a create/read/update response. */
export function pickOne<T>(data: unknown, key: string): T {
  const d = data as Record<string, unknown> | undefined;
  return (d?.[key] ?? d?.data ?? d ?? {}) as T;
}
