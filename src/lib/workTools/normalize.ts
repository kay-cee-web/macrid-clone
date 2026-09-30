import { eventsFor, modeOf, workToolKey } from "@/data/connectors/workTools";
import { pickField, toBool, toMaybeNumber, toText } from "@/lib/api/pick";
import { toFields } from "@/lib/connections/providerFields";
import type { WorkToolConnection, WorkToolEvent, WorkToolMode, WorkToolProvider } from "@/types/workTool";

/**
 * Readers for the /work-tools routes.
 *
 * **`toProvider` is confirmed** against a live reply (2026-09-30):
 * `{status, providers: [{provider, label, mode: "speak"|"watch", blurb, fields:
 * [{name, label}], help, events: ["assigned", …] | null}]}` — the key is
 * `provider`, capabilities are `events`, and the fields carry **no type**, so
 * `toFields` decides which are secrets. `blurb` is the backend's own card copy;
 * we keep the catalogue's, which the cards can draw before any fetch.
 *
 * **`toConnection` is not.** `GET /work-tools` answered `{status, connections:
 * []}`, so the envelope key is confirmed and the row shape isn't — no
 * connection has ever been made. `watch` and `every_minutes` are the doc's own
 * words; the rest is read tolerantly and modelled on /payments/connections and
 * /email-platforms. Check it against the first real row.
 */
type Row = Record<string, unknown>;

const toStrings = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(toText).filter(Boolean) : toText(value) ? [toText(value)] : [];

/**
 * Which events to offer. The backend decides — it sends `["assigned",
 * "mentioned", …]`, bare strings with no labels (confirmed 2026-09-30) — but the
 * wording is ours, because "Assigned" on its own doesn't say assigned to whom.
 * So a value we know keeps our catalogue's label and anything new gets a
 * readable one. A `speak` provider sends `events: null` and gets none.
 */
function toEvents(value: unknown, key: string): WorkToolEvent[] {
  const ours = eventsFor(key);
  const labelFor = (v: string) =>
    ours.find((event) => event.value === v)?.label
    ?? v.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  const sent = (Array.isArray(value) ? value : [])
    .map((row): WorkToolEvent => {
      if (typeof row === "string") return { value: row, label: labelFor(row) };
      const r = row as Row;
      const v = toText(pickField(r, ["value", "key", "event", "name"]));
      return { value: v, label: toText(pickField(r, ["label", "title"])) || labelFor(v) };
    })
    .filter((event) => event.value);
  return sent.length ? sent : ours;
}

export function toProvider(row: Row, fallbackKey = ""): WorkToolProvider {
  const raw = toText(pickField(row, ["key", "provider", "id", "slug"])) || fallbackKey;
  const key = workToolKey(raw);
  const sentMode = toText(pickField(row, ["mode", "kind", "type"]));
  return {
    key,
    name: toText(pickField(row, ["label", "name", "title"])) || key,
    mode: sentMode === "speak" || sentMode === "watch" ? (sentMode as WorkToolMode) : modeOf(key),
    fields: toFields(pickField(row, ["fields", "credentials", "needs"])),
    help: toText(pickField(row, ["help", "instructions", "where"])),
    events: toEvents(pickField(row, ["events", "watch", "can"]), key),
  };
}

export function toConnection(row: Row): WorkToolConnection {
  const key = workToolKey(toText(pickField(row, ["provider", "platform", "tool", "service", "key"])));
  const off = toBool(pickField(row, ["is_active", "active", "enabled"]), true) === false;
  const problem = toText(pickField(row, ["last_error", "error", "problem"]));
  const sentMode = toText(row.mode);
  return {
    id: toText(row.id),
    provider: key,
    // The row's own mode if it carries one — /work-tools/providers does.
    mode: sentMode === "speak" || sentMode === "watch" ? (sentMode as WorkToolMode) : modeOf(key),
    watch: toStrings(pickField(row, ["watch", "events"])),
    notifyChannel: toText(pickField(row, ["notify_channel", "notify", "notifyChannel", "channel"])),
    everyMinutes: toMaybeNumber(pickField(row, ["every_minutes", "everyMinutes", "interval"])),
    lastCheckedAt: toText(pickField(row, ["last_checked_at", "last_checked", "checked_at", "last_synced"])),
    // Polling failures never reach the user as a message, by design — the
    // connections screen is where they are supposed to show up.
    problem: problem || (off ? "Stopped. Reconnect to start it again." : ""),
    account: toText(pickField(row, ["account", "name", "label", "site", "shop", "channel_name", "chat_id"])),
  };
}
