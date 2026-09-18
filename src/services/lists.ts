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

/**
 * DELETE /lists/{id}. The leads on it stay; only the list goes.
 *
 * That route has been seen to answer `{success: false, message: "Failed to
 * delete list"}` (2026-09-18), so a failure is retried through the bulk route,
 * which is a different controller method, with the one id. If that fails too
 * the first error is what the user sees, because it names the resource.
 */
export async function deleteList(id: string) {
  try {
    const { data } = await api.delete(`/lists/${id}`);
    return assertEnvelope(data, "Could not delete the list");
  } catch (err) {
    const { data } = await api.post("/lists/bulk-delete", { ids: [id] }).catch(() => {
      throw err;
    });
    return assertEnvelope(data, "Could not delete the list");
  }
}

/** There is no single-list endpoint; find it in the full list. */
export async function fetchList(id: string): Promise<RecordList | null> {
  const lists = await fetchLists();
  return lists.find((list) => list.id === id) ?? null;
}
