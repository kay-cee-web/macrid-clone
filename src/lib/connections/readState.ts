import { CONNECTORS, CONNECTORS_BY_KEY, CONNECTOR_ALIASES } from "@/data/connectors";
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

/** GET /connectors */
export function applyModernRows(state: Record<string, ConnectionState>, payload: unknown) {
  for (const row of readRows(payload)) {
    const key = connectorKey(row);
    if (!key) continue;
    state[key] = {
      status: isConnected(row) ? "connected" : "disconnected",
      recordId: idOf(row),
      detail: String(row.account_email ?? row.key_hint ?? ""),
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
