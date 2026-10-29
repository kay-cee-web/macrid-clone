import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickField, toBool, toMaybeNumber, toText } from "@/lib/api/pick";
import type { AdAccountOverview, AdCampaign, AdsOverview, AdTotals } from "@/types/ads";

/**
 * `GET /ads/overview?from=&to=` (probed 2026-10-29): `{status, from, to,
 * accounts: [{id, platform, name, avatar, currency, active, error,
 * performance: {period, currency, totals: {spend, impressions, clicks, ctr, cpc},
 * campaigns: []}}]}`. Without dates it covers the last 30 days. A date it can't
 * parse is a 500, not a 422, so the page only ever sends YYYY-MM-DD.
 */
type Row = Record<string, unknown>;

const toTotals = (row: Row): AdTotals => ({
  spend: toMaybeNumber(row.spend),
  impressions: toMaybeNumber(row.impressions),
  clicks: toMaybeNumber(row.clicks),
  ctr: toText(row.ctr),
  cpc: toMaybeNumber(row.cpc),
});

const toCampaign = (row: Row): AdCampaign => ({
  id: toText(pickField(row, ["id", "campaign_id"])),
  name: toText(pickField(row, ["name", "campaign_name", "title"])) || "Unnamed campaign",
  status: toText(pickField(row, ["status", "effective_status", "state"])),
  totals: toTotals((row.totals as Row) ?? row),
});

function toAccount(row: Row): AdAccountOverview {
  const performance = (row.performance ?? {}) as Row;
  const campaigns = Array.isArray(performance.campaigns) ? (performance.campaigns as Row[]) : [];
  return {
    id: toText(row.id),
    platform: toText(row.platform),
    name: toText(row.name),
    currency: toText(row.currency ?? performance.currency).toUpperCase(),
    active: toBool(row.active, true),
    error: toText(row.error ?? performance.error),
    period: toText(performance.period),
    totals: toTotals((performance.totals ?? {}) as Row),
    campaigns: campaigns.map(toCampaign),
  };
}

export async function fetchAdsOverview(from: string, to: string): Promise<AdsOverview> {
  const { data } = await api.get("/ads/overview", { params: { from, to } });
  assertEnvelope(data, "Could not load your ad performance");
  const body = data as Row;
  const accounts = Array.isArray(body.accounts) ? (body.accounts as Row[]) : [];
  return { from: toText(body.from), to: toText(body.to), accounts: accounts.map(toAccount) };
}
