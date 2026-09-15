import { isAxiosError } from "axios";
import { api } from "@/lib/api/client";
import { assertEnvelope, extractApiError } from "@/lib/api/errors";
import { applyLegacyRows, applyModernRows, applyPlatformRows, blankState } from "@/lib/connections/readState";
import type { Connections, ConnectionState, Connector } from "@/types/connector";

/**
 * Workspace connections (shared by every agent). /connectors is the newer
 * route and may 404; /integrations is the legacy one. Google Places keys are
 * always in /platform-apis. Writes must go to the routes of whichever read answered.
 */
async function readPlatformKeys(state: Record<string, ConnectionState>, problems: string[]) {
  try {
    const { data } = await api.get("/platform-apis");
    assertEnvelope(data, "Could not read your platform keys");
    applyPlatformRows(state, data);
  } catch (err) {
    problems.push(extractApiError(err, "Could not load your Google Places key"));
  }
}

export async function fetchConnections(): Promise<Connections> {
  const state = blankState();
  const problems: string[] = [];
  let source: Connections["source"] = "connectors";

  try {
    const { data } = await api.get("/connectors");
    assertEnvelope(data, "Could not read your connections");
    applyModernRows(state, data);
  } catch (err) {
    source = "legacy";
    // A 404 just means the newer route isn't deployed; anything else is worth reporting.
    if (!(isAxiosError(err) && err.response?.status === 404)) {
      problems.push(extractApiError(err, "Could not read your connections"));
    }
    try {
      const { data } = await api.get("/integrations");
      assertEnvelope(data, "Could not read your integrations");
      applyLegacyRows(state, data);
    } catch (legacyErr) {
      problems.push(extractApiError(legacyErr, "Could not load your email platforms"));
    }
  }

  await readPlatformKeys(state, problems);
  return { source, state, problems };
}

/** Where the consent popup should go. */
export async function fetchOAuthUrl(connector: Connector): Promise<string> {
  if (!connector.connect) throw new Error(`${connector.name} has no connect route.`);
  const { data } = await api.get(connector.connect);
  assertEnvelope(data, `Could not start ${connector.name}`);
  const url = data?.auth_url ?? data?.authUrl ?? data?.url;
  if (typeof url !== "string" || !url) throw new Error("No sign-in link came back. Try again.");
  return url;
}

export async function connectApiKey(connector: Connector, values: Record<string, string>, source: Connections["source"]) {
  const platform = connector.store === "platform_apis";
  const url = platform ? "/platform-apis" : source === "connectors" ? `/connectors/${connector.key}/api-key` : "/integrations";
  const body = platform || source === "connectors" ? values : { service: connector.key, ...values, status: "1" };

  const { data } = await api.post(url, body);
  assertEnvelope(data, `Could not connect ${connector.name}`);
  return typeof data?.message === "string" ? data.message : `${connector.name} connected.`;
}

export async function disconnectConnector(connector: Connector, connection: ConnectionState, source: Connections["source"]) {
  if (connector.store === "platform_apis") {
    // No per-key delete here: save the same fields emptied.
    const cleared = Object.fromEntries((connector.fields ?? []).map((field) => [field.name, ""]));
    const { data } = await api.post("/platform-apis", cleared);
    assertEnvelope(data, `Could not remove ${connector.name}`);
    return `${connector.name} key removed.`;
  }
  if (source === "legacy" && !connection.recordId) throw new Error(`Nothing to disconnect for ${connector.name}.`);
  const url = source === "connectors" ? `/connectors/${connector.key}` : `/integrations/${connection.recordId}`;
  const { data } = await api.delete(url);
  assertEnvelope(data, `Could not disconnect ${connector.name}`);
  return typeof data?.message === "string" ? data.message : `${connector.name} disconnected.`;
}
