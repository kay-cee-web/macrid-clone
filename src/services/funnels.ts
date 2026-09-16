import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList, toNumber } from "@/lib/api/pick";
import { newestFirst } from "@/lib/records/normalizeCrm";
import { normalizeFunnel, normalizeFunnelEvent, normalizeFunnelStats } from "@/lib/records/normalizeFunnels";
import type { Funnel, FunnelEvent, FunnelStats } from "@/types/funnels";

type Row = Record<string, unknown>;

/** GET /funnel-campaigns → `{data: [...]}`. Not paginated. */
export async function fetchFunnels(): Promise<Funnel[]> {
  const { data } = await api.get("/funnel-campaigns");
  assertEnvelope(data, "Could not load your funnels");
  return newestFirst(pickList<Row>(data, "campaigns").map(normalizeFunnel));
}

/** Totals for one funnel, by slug. */
export async function fetchFunnelStats(slug: string): Promise<FunnelStats> {
  const { data } = await api.get(`/funnel-campaign-events/${encodeURIComponent(slug)}/stats`);
  assertEnvelope(data, "Could not load this funnel's numbers");
  const body = (data ?? {}) as Row;
  const nested = body.views === undefined && body.data && typeof body.data === "object";
  return normalizeFunnelStats((nested ? body.data : body) as Row);
}

/** The latest visits and clicks: first page of a Laravel paginator at `data`. */
export async function fetchFunnelEvents(slug: string, perPage = 50): Promise<{ events: FunnelEvent[]; total: number }> {
  const { data } = await api.get("/funnel-campaign-events", { params: { slug, per_page: perPage, page: 1 } });
  assertEnvelope(data, "Could not load this funnel's activity");
  const paginator = ((data as Row)?.data ?? {}) as Row;
  const rows = Array.isArray(paginator) ? (paginator as Row[]) : pickList<Row>(paginator, "data");
  return { events: rows.map(normalizeFunnelEvent), total: toNumber(paginator.total) || rows.length };
}
