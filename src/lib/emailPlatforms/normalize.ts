import { pickField, toBool, toMaybeNumber, toText } from "@/lib/api/pick";
import { LISTLESS, listWordFor, platformKey } from "@/data/connectors/emailPlatforms";
import { toFields } from "@/lib/connections/providerFields";
import type { EmailPlatformConnection, EmailPlatformProvider, RemoteList, SyncResult } from "@/types/emailPlatform";

/**
 * Readers for the /email-platforms routes. No sample payloads shipped with the
 * doc, so every row is read tolerantly and the platform's own word for a list
 * falls back to our catalogue when the API doesn't send one.
 */
type Row = Record<string, unknown>;

export function toProvider(row: Row, fallbackKey = ""): EmailPlatformProvider {
  const raw = toText(pickField(row, ["key", "platform", "provider", "id", "slug"])) || fallbackKey;
  const key = platformKey(raw);
  const listWord = toText(pickField(row, ["list_word", "listWord", "list_label", "list_name_singular"]));
  return {
    key,
    name: toText(pickField(row, ["label", "name", "title"])) || key,
    fields: toFields(pickField(row, ["fields", "credentials"])),
    help: toText(pickField(row, ["help", "instructions", "where"])),
    listWord: listWord || listWordFor(key),
    // A platform that says it takes no list is listless; otherwise our own list decides.
    listless: toBool(pickField(row, ["listless", "no_lists"]), LISTLESS.includes(key)),
  };
}

export function toRemoteList(row: Row): RemoteList {
  return {
    id: toText(pickField(row, ["id", "list_id", "remote_id", "value"])),
    name: toText(pickField(row, ["name", "label", "title"])),
    count: toMaybeNumber(pickField(row, ["count", "contacts_count", "subscribers", "member_count"])),
  };
}

export function toConnection(row: Row): EmailPlatformConnection {
  const key = platformKey(toText(pickField(row, ["platform", "provider", "service", "key"])));
  const listWord = toText(pickField(row, ["list_word", "listWord", "list_label"]));
  const off = toBool(pickField(row, ["is_active", "active"]), true) === false;
  const problem = toText(pickField(row, ["last_error", "error", "problem"]));
  return {
    id: toText(row.id),
    platform: key,
    listId: toText(pickField(row, ["list_id", "remote_list_id", "listId"])),
    // `list` is the chosen list's name; `name` is the platform's own, so never that.
    listName: toText(pickField(row, ["list", "list_name", "listName"])),
    listWord: listWord || listWordFor(key),
    listless: LISTLESS.includes(key),
    problem: problem || (off ? "The key stopped working." : ""),
    lastSyncedAt: toText(pickField(row, ["last_synced", "last_synced_at", "synced_at"])),
  };
}

/** `{imported, skipped, failed, message}` under whichever names the route uses. */
export function toSyncResult(body: Row, fallback: string): SyncResult {
  return {
    done: toMaybeNumber(pickField(body, ["done", "imported", "pushed", "synced", "count", "total"])) ?? 0,
    skipped: toMaybeNumber(pickField(body, ["skipped", "duplicates", "dropped"])) ?? 0,
    failed: toMaybeNumber(pickField(body, ["failed", "errors_count"])) ?? 0,
    message: toText(body.message) || fallback,
  };
}
