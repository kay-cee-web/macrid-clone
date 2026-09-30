import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList } from "@/lib/api/pick";
import { newestFirst, normalizeTask, uniqueById } from "@/lib/records/normalizeCrm";
import type { Task } from "@/types/records";

/** GET /tasks → `{tasks: [...]}`. Not paginated. */
export async function fetchTasks(): Promise<Task[]> {
  const { data } = await api.get("/tasks");
  assertEnvelope(data, "Could not load your tasks");
  return newestFirst(uniqueById(pickList<Record<string, unknown>>(data, "tasks").map(normalizeTask)));
}
