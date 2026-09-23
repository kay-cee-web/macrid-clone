import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList, toText } from "@/lib/api/pick";

/**
 * Google, one OAuth grant per service (gmail = sending only, calendar, drive,
 * sheets, docs, contacts, gbp). Grants add up on the Google account, and
 * disconnecting one service only drops it here; "all" revokes at Google.
 */
type Row = Record<string, unknown>;

export type GoogleService = { service: string; connected: boolean; email: string; error: string };

/**
 * Seen 2026-09-23: `{services: [{service, label, does, status: "active"|"disconnected", account, expires, error}]}`.
 * `expires` is the access token's, which the backend refreshes, so a past date doesn't mean disconnected.
 */
export async function fetchGoogleServices(): Promise<GoogleService[]> {
  const { data } = await api.get("/connectors/google/services");
  assertEnvelope(data, "Could not read your Google connections");
  return pickList<Row>(data, "services").map((row) => ({
    service: toText(row.service).toLowerCase(),
    connected: toText(row.status).toLowerCase() === "active",
    email: toText(row.account),
    error: toText(row.error),
  }));
}

export async function disconnectGoogleService(service: string, name: string) {
  const { data } = await api.post("/connectors/google/disconnect", { service });
  assertEnvelope(data, `Could not disconnect ${name}`);
  return toText((data as Row)?.message) || `${name} disconnected.`;
}
