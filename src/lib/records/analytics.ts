import { statusLabel } from "@/lib/records/status";
import type { EmailCampaign, SmsCampaign, SmsLog, WhatsAppCampaign } from "@/types/records";

/**
 * Outreach analytics. There are no /analytics endpoints: like Macrid, every
 * number is worked out here from the campaign rows and SMS logs.
 */
export const RANGES = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "all", label: "All time" },
] as const;
export type Range = (typeof RANGES)[number]["value"];

const DAY = 86_400_000;

export function inRange<T extends { createdAt: string | null }>(rows: T[], range: Range, now = Date.now()): T[] {
  if (range === "all") return rows;
  const since = now - Number(range) * DAY;
  return rows.filter((row) => row.createdAt && new Date(row.createdAt).getTime() >= since);
}

const sum = (values: (number | null)[]) => values.reduce<number>((total, value) => total + (value ?? 0), 0);
const mean = (values: (number | null)[]) => {
  const known = values.filter((v): v is number => v !== null);
  return known.length ? sum(known) / known.length : null;
};
const is = (status: string, ...names: string[]) => names.includes(statusLabel(status).toLowerCase());

export function emailSummary(campaigns: EmailCampaign[]) {
  const sent = campaigns.filter((c) => is(c.status, "sent"));
  return {
    campaigns: campaigns.length,
    sent: sent.length,
    recipients: sum(sent.map((c) => c.recipients)),
    openRate: mean(sent.map((c) => c.openRate)),
    clickRate: mean(sent.map((c) => c.clickRate)),
    failed: campaigns.filter((c) => is(c.status, "failed")).length,
    /** Best open rate first; only sent campaigns with a rate. */
    top: [...sent].filter((c) => c.openRate !== null).sort((a, b) => (b.openRate ?? 0) - (a.openRate ?? 0)).slice(0, 5),
  };
}

export function smsSummary(campaigns: SmsCampaign[], logs: SmsLog[]) {
  const ids = new Set(campaigns.map((c) => c.id));
  const mine = logs.filter((log) => ids.has(log.campaignId));
  const delivered = mine.filter((log) => is(log.status, "delivered")).length;
  return {
    campaigns: campaigns.length,
    messages: mine.length,
    delivered,
    deliveryRate: mine.length ? (delivered / mine.length) * 100 : null,
    failed: mine.filter((log) => is(log.status, "failed", "undelivered")).length,
  };
}

export function whatsappSummary(campaigns: WhatsAppCampaign[]) {
  const sent = sum(campaigns.map((c) => c.sent ?? c.delivered));
  const read = sum(campaigns.map((c) => c.read));
  const replied = sum(campaigns.map((c) => c.replied));
  return {
    campaigns: campaigns.length,
    sent,
    readRate: sent ? (read / sent) * 100 : null,
    replyRate: sent ? (replied / sent) * 100 : null,
    failed: sum(campaigns.map((c) => c.failed)),
  };
}

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
export const formatCount = (value: number) => compact.format(value);
export const formatRate = (value: number | null) => (value === null ? "" : `${value.toFixed(1)}%`);
