import { CONNECTORS, CONNECTORS_BY_KEY, CONNECTOR_ALIASES } from "@/data/connectors";
import type { GoogleService } from "@/services/googleConnectors";
import { SIGNS_WITH_KEY } from "@/data/connectors/payments";
import type { Mailbox } from "@/services/mailboxes";
import type { PaymentConnection } from "@/types/payment";
import type { ConnectionState } from "@/types/connector";

type Row = Record<string, unknown>;

export const blankState = (): Record<string, ConnectionState> =>
  Object.fromEntries(CONNECTORS.map((c) => [c.key, { status: "unknown", recordId: null, detail: "" }]));

/** Rows may sit at data, data.data, data.integrations or data.connectors. */
export function readRows(payload: unknown): Row[] {
  const p = payload as Row | undefined;
  const body = (p?.data ?? p) as Row | Row[] | undefined;
  if (Array.isArray(body)) return body;
  for (const key of ["data", "integrations", "connectors"]) {
    const list = (body as Row | undefined)?.[key];
    if (Array.isArray(list)) return list as Row[];
  }
  return [];
}

const idOf = (row: Row) => (row.id === undefined || row.id === null ? null : String(row.id));

/** Tolerant match: case and a few historical names shouldn't hide a real connection. */
function connectorKey(row: Row): string | null {
  const raw = row.key ?? row.service ?? row.provider ?? row.name;
  if (!raw) return null;
  const key = String(raw).trim().toLowerCase();
  const resolved = CONNECTOR_ALIASES[key] ?? key;
  return CONNECTORS_BY_KEY[resolved] ? resolved : null;
}

function isConnected(row: Row): boolean {
  const flag = row.connected ?? row.is_connected ?? row.active ?? row.status;
  if (flag === true || flag === 1 || flag === "1") return true;
  return typeof flag === "string" && ["connected", "active", "success", "true"].includes(flag.toLowerCase());
}

/**
 * GET /connectors. Seen 2026-09-24: rows carry `connected`, `status`
 * ("active" | "not_connected"), `account_email` or `key_hint`, and, for OAuth,
 * `needs_action` — the backend's own "needs attention" (a token to sign in again).
 */
export function applyModernRows(state: Record<string, ConnectionState>, payload: unknown) {
  for (const row of readRows(payload)) {
    const key = connectorKey(row);
    if (!key) continue;
    const detail = String(row.account_email ?? row.key_hint ?? "");
    const broken = isConnected(row) && (row.needs_action === true || row.needs_action === 1);
    state[key] = {
      status: broken ? "attention" : isConnected(row) ? "connected" : "disconnected",
      recordId: idOf(row),
      detail: broken ? String(row.error ?? row.message ?? "") || "Sign in again to keep it working." : detail,
    };
  }
}

/** GET /integrations: status 0 means off; any other row means on. */
export function applyLegacyRows(state: Record<string, ConnectionState>, payload: unknown) {
  for (const row of readRows(payload)) {
    const key = String(row.service ?? row.serviceName ?? "").toLowerCase();
    if (!CONNECTORS_BY_KEY[key]) continue;
    const off = row.status === 0 || row.status === "0";
    const detail = row.list_id ? `List ${row.list_id}` : row.form_id ? `Form ${row.form_id}` : row.group_id ? `Group ${row.group_id}` : "";
    state[key] = { status: off ? "disconnected" : "connected", recordId: idOf(row), detail };
  }
}

/** GET /connectors/google/services: the one source for every Google card. */
export function applyGoogleServices(state: Record<string, ConnectionState>, services: GoogleService[]) {
  for (const connector of CONNECTORS.filter((c) => c.googleService)) {
    const found = services.find((s) => s.service === connector.googleService);
    if (!found) continue;
    // A granted service that reports an error (an expired or revoked token) needs attention.
    const status = found.connected ? (found.error ? "attention" : "connected") : "disconnected";
    state[connector.key] = { status, recordId: null, detail: found.error || found.email };
  }
}

/** GET /mailboxes: connected once one works; saved ones that all fail (a revoked app password) need attention. */
export function applyMailboxes(state: Record<string, ConnectionState>, mailboxes: Mailbox[]) {
  const active = mailboxes.filter((m) => m.active);
  const emails = active.map((m) => m.email).filter(Boolean);
  if (!active.length && mailboxes.length) {
    const first = mailboxes[0];
    state.mailbox = { status: "attention", recordId: first.id, detail: first.error || `${first.email} stopped signing in` };
    return;
  }
  state.mailbox = {
    status: active.length ? "connected" : "disconnected",
    recordId: active[0]?.id ?? null,
    detail: emails.length > 1 ? `${emails[0]} +${emails.length - 1} more` : emails[0] ?? "",
  };
}

/**
 * GET /payments/connections: one card per provider, standing for its first
 * account. A broken key, or a webhook secret never saved, needs attention.
 */
export function applyPayments(state: Record<string, ConnectionState>, connections: PaymentConnection[]) {
  for (const connector of CONNECTORS.filter((c) => c.store === "payments")) {
    const mine = connections.filter((c) => c.provider === connector.key);
    const first = mine[0];
    if (!first) {
      state[connector.key] = { status: "disconnected", recordId: null, detail: "" };
      continue;
    }
    const secretMissing = first.webhookReady === false && !SIGNS_WITH_KEY.includes(connector.key);
    const problem = first.problem || (secretMissing ? "Webhook secret not set, so live alerts can't arrive." : "");
    const more = mine.length > 1 ? ` +${mine.length - 1} more` : "";
    state[connector.key] = {
      status: problem ? "attention" : "connected",
      recordId: first.id,
      detail: problem || `${first.account}${first.live ? "" : " · sandbox"}${more}`,
    };
  }
}

/** GET /platform-apis: Google Places lives here, not in /connectors. */
export function applyPlatformRows(state: Record<string, ConnectionState>, payload: unknown) {
  const rows = readRows(payload);
  if (!rows.length) return;
  const withKey = rows.find((r) => r.google_place_api_key);
  state.google_places = {
    status: withKey ? "connected" : "disconnected",
    recordId: idOf(withKey ?? rows[0]),
    detail: withKey ? "Your own key, no daily limit" : "",
  };
}
