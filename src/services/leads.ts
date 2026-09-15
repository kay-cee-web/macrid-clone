import { fetchAllPages } from "@/lib/api/paginate";
import { newestFirst, normalizeLead } from "@/lib/records/normalizeCrm";
import type { Lead } from "@/types/records";

/**
 * GET /leads?list=<id>&page&per_page → paginator at `data`. `search` is ignored
 * by the API, so every page is read (like Macrid) and filtered in the browser.
 */
export async function fetchLeads(filters: { listId?: string } = {}): Promise<{ leads: Lead[]; truncated: boolean }> {
  const { rows, truncated } = await fetchAllPages("/leads", {
    params: filters.listId ? { list: filters.listId } : {},
    key: "leads",
    perPage: 1000,
    maxPages: 10,
    fallback: "Could not load leads",
  });
  return { leads: newestFirst(rows.map(normalizeLead)), truncated };
}
