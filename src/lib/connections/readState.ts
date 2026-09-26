import { CONNECTORS, CONNECTORS_BY_KEY, CONNECTOR_ALIASES } from "@/data/connectors";
import type { ConnectionState } from "@/types/connector";

/**
 * Readers for the "others" layer: /connectors, /integrations behind it, and
 * /platform-apis. It speaks for every connector with no group of its own, and
 * stands in for the grouped ones only while their own route can't be read —
 * each group's reader (`ownedState.ts`) overwrites it. See `connectionSources.ts`.
 */
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

