import { toMaybeNumber, toNumber, toText } from "@/lib/api/pick";
import type { Funnel, FunnelEvent, FunnelStats } from "@/types/funnels";

type Row = Record<string, unknown>;

const withScheme = (url: string) => (!url || /^https?:\/\//i.test(url) ? url : `https://${url}`);

/**
 * The public address comes from the backend, like Macrid: landing pages live on
 * their custom domain or temp subdomain; other formats on funnelcampaign_url.
 */
function publicUrl(row: Row): string {
  const landing = toText(row.format).toLowerCase().includes("landing");
  const site = toText(row.custom_domain) || toText(row.temp_url);
  return withScheme(landing ? site || toText(row.funnelcampaign_url) : toText(row.funnelcampaign_url) || site);
}

export function normalizeFunnel(row: Row): Funnel {
  return {
    id: toText(row.id),
    slug: toText(row.slug),
    name: toText(row.name) || toText(row.slug) || "Untitled funnel",
    format: toText(row.format).replace(/[_-]+/g, " "),
    published: toNumber(row.status) === 1 || toText(row.status).toLowerCase() === "published",
    url: publicUrl(row),
    createdAt: toText(row.created_at) || null,
  };
}

/** GET /funnel-campaign-events/{slug}/stats: fields sit flat on the body. */
export function normalizeFunnelStats(body: Row): FunnelStats {
  return {
    views: toNumber(body.views),
    clicks: toNumber(body.clicks),
    uniqueVisitors: toNumber(body.unique_visitors),
    viewsChange: toMaybeNumber(body.views_change),
    clicksChange: toMaybeNumber(body.clicks_change),
    visitorsChange: toMaybeNumber(body.visitors_change),
  };
}

export function normalizeFunnelEvent(row: Row, index: number): FunnelEvent {
  return {
    id: toText(row.id) || String(index),
    action: toText(row.action),
    location: [toText(row.city), toText(row.country)].filter(Boolean).join(", "),
    device: [toText(row.device_type), toText(row.browser)].filter(Boolean).join(" · "),
    referrer: toText(row.referrer),
    at: toText(row.created_at) || null,
  };
}
