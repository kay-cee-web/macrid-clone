import { isAxiosError } from "axios";
import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList } from "@/lib/api/pick";
import { newestFirst } from "@/lib/records/normalizeCrm";
import {
  normalizeEmailCampaign,
  normalizeSmsCampaign,
  normalizeSmsLog,
  normalizeWhatsAppCampaign,
} from "@/lib/records/normalizeOutreach";
import type { EmailCampaign, SmsCampaign, SmsLog, WhatsAppCampaign } from "@/types/records";

type Row = Record<string, unknown>;

/** GET /email-campaigns → `{data: [...]}`. Not paginated. */
export async function fetchEmailCampaigns(): Promise<EmailCampaign[]> {
  const { data } = await api.get("/email-campaigns");
  assertEnvelope(data, "Could not load email campaigns");
  return newestFirst(pickList<Row>(data, "campaigns").map(normalizeEmailCampaign));
}

/** GET /sms-campaigns → `{success, data: [...]}`. Not paginated. */
export async function fetchSmsCampaigns(): Promise<SmsCampaign[]> {
  const { data } = await api.get("/sms-campaigns");
  assertEnvelope(data, "Could not load SMS campaigns");
  return newestFirst(pickList<Row>(data, "campaigns").map(normalizeSmsCampaign));
}

/** Every text in one SMS campaign, with delivery status and cost. */
export async function fetchSmsLogs(campaignId: string): Promise<SmsLog[]> {
  const { data } = await api.get("/sms-logs/sms-campaign-id", { params: { smscampaign_id: campaignId } });
  assertEnvelope(data, "Could not load this campaign's messages");
  return pickList<Row>(data, "logs").map(normalizeSmsLog);
}

/** GET /sms-logs: every text across campaigns (no pagination), for delivery rates. */
export async function fetchAllSmsLogs(): Promise<SmsLog[]> {
  const { data } = await api.get("/sms-logs");
  assertEnvelope(data, "Could not load SMS delivery logs");
  return pickList<Row>(data, "logs").map(normalizeSmsLog);
}

/**
 * WhatsApp broadcasts. Macrid lists them at "/whatsapp.campaigns" (a dot) while
 * the detail route uses a slash, so try the dot first and the slash on a 404.
 */
export async function fetchWhatsAppCampaigns(): Promise<WhatsAppCampaign[]> {
  let body: unknown;
  try {
    ({ data: body } = await api.get("/whatsapp.campaigns"));
  } catch (err) {
    if (!(isAxiosError(err) && err.response?.status === 404)) throw err;
    ({ data: body } = await api.get("/whatsapp/campaigns"));
  }
  assertEnvelope(body, "Could not load WhatsApp broadcasts");
  return newestFirst(pickList<Row>(body, "campaigns").map(normalizeWhatsAppCampaign));
}
