import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList } from "@/lib/api/pick";
import { newestFirst } from "@/lib/records/normalizeCrm";
import { normalizeEmailCampaign, normalizeSmsCampaign } from "@/lib/records/normalizeOutreach";
import type { EmailCampaign, SmsCampaign } from "@/types/records";

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
