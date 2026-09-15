import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList } from "@/lib/api/pick";
import { newestFirst, normalizeList } from "@/lib/records/normalizeCrm";
import type { RecordList } from "@/types/records";

/** GET /lists → `{lists: [...]}`. Not paginated. */
export async function fetchLists(): Promise<RecordList[]> {
  const { data } = await api.get("/lists");
  assertEnvelope(data, "Could not load your lists");
  return newestFirst(pickList<Record<string, unknown>>(data, "lists").map(normalizeList));
}

/** There is no single-list endpoint; find it in the full list. */
export async function fetchList(id: string): Promise<RecordList | null> {
  const lists = await fetchLists();
  return lists.find((list) => list.id === id) ?? null;
}
