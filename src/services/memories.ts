import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { normalizeMemory, toMemoryPayload } from "@/lib/memories/normalize";
import { pickList, pickOne } from "@/lib/api/pick";
import type { Memory, MemoryInput, MemoryKind, MemoryRow } from "@/types/memory";

/**
 * Agent memory — facts from `remember`, and the skills the agent writes for
 * itself with `save_skill` (SETUP.md).
 *
 * NOT LIVE YET. Probed 2026-09-18: `GET /memories` answers 404 "Route not
 * found", so nothing calls this file. Once it ships, `kind=skill` becomes the
 * per-account half of the static catalogue in `src/data/skills`.
 */
const BASE = "/memories";

/** Everything remembered, or just the facts / just the skills. */
export async function fetchMemories(kind?: MemoryKind): Promise<Memory[]> {
  const { data } = await api.get(BASE, { params: kind ? { kind } : undefined });
  assertEnvelope(data, "Could not load the agent's memory");
  return pickList<MemoryRow>(data, "memories").map(normalizeMemory);
}

/** Teach the agent something by hand, rather than through a chat turn. */
export async function createMemory(input: MemoryInput): Promise<Memory> {
  const { data } = await api.post(BASE, toMemoryPayload(input));
  assertEnvelope(data, "Could not save that memory");
  return normalizeMemory(pickOne<MemoryRow>(data, "memory"));
}

/** Forget one entry. The agent's own `forget` tool does the same thing. */
export async function deleteMemory(memoryId: string): Promise<void> {
  const { data } = await api.delete(`${BASE}/${memoryId}`);
  assertEnvelope(data, "Could not delete that memory");
}
