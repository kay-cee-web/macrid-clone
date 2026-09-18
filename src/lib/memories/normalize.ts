import { pickField, toText } from "@/lib/api/pick";
import type { Memory, MemoryInput, MemoryKind, MemoryRow } from "@/types/memory";

/**
 * Tolerant readers for memory rows, on the same terms as `lib/tasks/normalize`:
 * the route isn't deployed, so fields are looked up under several names and the
 * untouched row is kept as `raw`.
 */

const memoryKind = (value: unknown): MemoryKind =>
  toText(value).toLowerCase() === "skill" ? "skill" : "fact";

export function normalizeMemory(row: MemoryRow): Memory {
  const raw = (row ?? {}) as unknown as Record<string, unknown>;
  return {
    id: String(raw.id ?? ""),
    kind: memoryKind(pickField(raw, ["kind", "type"])),
    label: toText(pickField(raw, ["key", "name", "title", "slug"])),
    value: toText(pickField(raw, ["value", "content", "body", "text"])),
    agentId: toText(pickField(raw, ["agent_id", "agentId"])) || null,
    createdAt: toText(raw.created_at) || null,
    updatedAt: toText(raw.updated_at) || toText(raw.created_at) || null,
    raw,
  };
}

/** Allowlist of writable fields for POST /memories. */
export function toMemoryPayload(input: MemoryInput) {
  const payload: Record<string, unknown> = { kind: input.kind, value: input.value };
  if (input.label !== undefined) payload.key = input.label;
  if (input.agentId !== undefined) payload.agent_id = input.agentId;
  return payload;
}
