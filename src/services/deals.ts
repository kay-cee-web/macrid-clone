import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList } from "@/lib/api/pick";
import { newestFirst, normalizeDeal } from "@/lib/records/normalizeCrm";
import type { Deal } from "@/types/records";

/** GET /deals → `{data: {deals: [...]}}`. Not paginated. */
export async function fetchDeals(): Promise<Deal[]> {
  const { data } = await api.get("/deals");
  assertEnvelope(data, "Could not load your deals");
  return newestFirst(pickList<Record<string, unknown>>(data, "deals").map(normalizeDeal));
}
