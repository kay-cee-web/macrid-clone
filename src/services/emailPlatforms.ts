import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList, pickOne, toText } from "@/lib/api/pick";
import { toConnection, toProvider, toRemoteList, toSyncResult } from "@/lib/emailPlatforms/normalize";
import type {
  EmailPlatformConnection, EmailPlatformProvider, RemoteList, SyncDirection, SyncResult,
} from "@/types/emailPlatform";

/**
 * /email-platforms owns the eight email platforms (backend doc 2026-09-26):
 * it is the only source for their cards, and /connectors never speaks for them.
 * Keys are tested before saving, encrypted, and never returned.
 */
type Row = Record<string, unknown>;

const messageOf = (data: unknown, fallback: string) => toText((data as Row)?.message) || fallback;

/**
 * The first nested object among candidate keys. `pickOne` falls back to the
 * whole envelope, which would read `{status, message}` as a row, so a response
 * that carries no row has to be recognisable as carrying none.
 */
function rowIn(data: unknown, keys: string[]): Row {
  const body = (data ?? {}) as Row;
  for (const key of keys) {
    const value = body[key];
    if (value && typeof value === "object" && !Array.isArray(value)) return value as Row;
  }
  return {};
}

/** Fields, help text and each platform's own word for a list, so the form builds itself. */
export async function fetchEmailPlatformProviders(): Promise<EmailPlatformProvider[]> {
  const { data } = await api.get("/email-platforms/providers");
  assertEnvelope(data, "Could not load the email platforms");
  const list = pickList<Row>(data, "providers");
  if (list.length) return list.map((row) => toProvider(row));
  return Object.entries(pickOne<Row>(data, "providers"))
    .filter(([, value]) => value && typeof value === "object")
    .map(([key, value]) => toProvider(value as Row, key));
}

/**
 * Rows sit under `connections` (confirmed 2026-09-26):
 * `{id, platform, name, list_word, list, list_id, pushed, pulled, is_active,
 * last_synced: "2 seconds ago", last_error}`. `name` is the platform's own name,
 * not the list's.
 */
export async function fetchEmailPlatforms(): Promise<EmailPlatformConnection[]> {
  const { data } = await api.get("/email-platforms");
  assertEnvelope(data, "Could not read your email platforms");
  const rows = pickList<Row>(data, "connections");
  return (rows.length ? rows : pickList<Row>(data, "platforms")).map(toConnection);
}

const listsIn = (data: unknown) => pickList<Row>(data, "lists").map(toRemoteList).filter((l) => l.id);

/**
 * The key is tested before it's saved, and the response carries the platform's
 * lists, so the caller can ask which one to use without a second request.
 */
export async function connectEmailPlatform(platform: string, credentials: Record<string, string>, name: string) {
  const { data } = await api.post("/email-platforms", { platform, credentials });
  assertEnvelope(data, `Could not connect ${name}`);
  const row = rowIn(data, ["platform", "connection", "email_platform", "data"]);
  return {
    connection: toConnection(Object.keys(row).length ? row : { platform }),
    lists: listsIn(data),
    message: messageOf(data, `${name} connected.`),
  };
}

export async function fetchEmailPlatformLists(id: string): Promise<RemoteList[]> {
  const { data } = await api.get(`/email-platforms/${id}/lists`);
  assertEnvelope(data, "Could not load the lists");
  return listsIn(data);
}

/** Which list on their side this platform reads from and writes to. */
export async function setEmailPlatformList(id: string, listId: string, listWord: string) {
  const { data } = await api.post(`/email-platforms/${id}/list`, { list_id: listId });
  assertEnvelope(data, `Could not choose the ${listWord}`);
  return messageOf(data, `${listWord} saved.`);
}

/**
 * pull imports their subscribers as leads, push sends leads out. Unsubscribed
 * contacts are dropped by the backend in both directions and that isn't
 * configurable, so nothing here offers to include them.
 */
export async function syncEmailPlatform(
  id: string,
  direction: SyncDirection,
  options: { listId?: string; listName?: string; limit?: number } = {},
): Promise<SyncResult> {
  const body: Row = {};
  if (options.listId) body.list_id = options.listId;
  if (options.listName) body.list_name = options.listName;
  if (options.limit) body.limit = options.limit;
  const { data } = await api.post(`/email-platforms/${id}/${direction}`, body);
  assertEnvelope(data, direction === "pull" ? "Could not import the contacts" : "Could not send the leads");
  // Counts may sit in a nested result or flat on the envelope, which also holds the message.
  const merged = { ...(data as Row), ...rowIn(data, ["result", "summary"]) };
  return toSyncResult(merged, direction === "pull" ? "Contacts imported." : "Leads sent.");
}

export async function disconnectEmailPlatform(id: string, name: string) {
  const { data } = await api.delete(`/email-platforms/${id}`);
  assertEnvelope(data, `Could not disconnect ${name}`);
  return messageOf(data, `${name} disconnected.`);
}
