import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { fetchAllPages } from "@/lib/api/paginate";
import { newestFirst, normalizeLead, uniqueById } from "@/lib/records/normalizeCrm";
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
    fallback: "Could not load customers",
  });
  return { leads: newestFirst(uniqueById(rows.map(normalizeLead))), truncated };
}

export type CustomerFields = {
  name: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  country: string;
  status: string;
};

/**
 * PUT /leads/{id}. Rows read the name as `first_name` + `last_name`, while
 * create takes a single `name`, so the whole name goes in `first_name` (and
 * `name`) with `last_name` cleared — otherwise an old surname would linger.
 * `list_id` goes too, so the customer stays on its list, and so does `score`:
 * a PUT without it stores "0" over an empty score (seen 2026-10-29).
 */
export async function updateLead(id: string, current: Pick<Lead, "listId" | "score">, fields: CustomerFields) {
  const { data } = await api.put(`/leads/${id}`, {
    list_id: current.listId || undefined,
    score: current.score,
    name: fields.name,
    first_name: fields.name,
    last_name: "",
    email: fields.email,
    phone: fields.phone,
    website: fields.website,
    city: fields.city,
    country: fields.country,
    lead_status: fields.status,
  });
  return assertEnvelope(data, "Could not save the customer");
}
