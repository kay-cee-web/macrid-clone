import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { blankState, readRows } from "@/lib/connections/readState";
import type { Connections, ConnectionState, Connector } from "@/types/connector";
import { readOthers, readOwnedGroups } from "./connectionSources";
import { connectEmailPlatform, disconnectEmailPlatform } from "./emailPlatforms";
import { disconnectGoogleService } from "./googleConnectors";
import { removeAllMailboxes } from "./mailboxes";
import { deletePaymentConnection } from "./payments";
import { createMailAccount, createSmsSender, removeAllMailAccounts, removeAllSmsSenders } from "./senders";

/**
 * Workspace connections, shared by every agent. Which route speaks for which
 * connector is declared in `connectionSources.ts`: each family's own route owns
 * it, and /connectors covers the rest. Writes go to the owning route too —
 * `store` picks it below — falling back to whichever read answered.
 */
export async function fetchConnections(): Promise<Connections> {
  const state = blankState();
  const problems: string[] = [];
  // Others first, then each group over the top: a group that answers is the last word.
  const source = await readOthers(state, problems);
  await readOwnedGroups(state, problems);
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

/**
 * POST /platform-apis replaces the whole row (Google Places and the AI keys),
 * so read it first and send every column back with only `patch` changed.
 */
export async function savePlatformKeys(patch: Record<string, string>, fallback: string) {
  const { data: current } = await api.get("/platform-apis");
  const row = readRows(current)[0] ?? {};
  const merged = Object.fromEntries(
    Object.entries(row).filter(([key, value]) => !["id", "user_id", "created_at", "updated_at"].includes(key) && value !== null),
  );
  const { data } = await api.post("/platform-apis", { ...merged, ...patch });
  assertEnvelope(data, fallback);
}

export async function connectApiKey(connector: Connector, values: Record<string, string>, source: Connections["source"]) {
  if (connector.store === "mail_accounts") return createMailAccount(values);
  if (connector.store === "sms_senders") return createSmsSender(values);
  // The key is tested and saved, and the lists come back with it; the target is chosen next.
  if (connector.store === "email_platforms") {
    const { message } = await connectEmailPlatform(connector.key, values, connector.name);
    return message;
  }
  if (connector.store === "platform_apis") {
    await savePlatformKeys(values, `Could not connect ${connector.name}`);
    return `${connector.name} connected.`;
  }
  const url = source === "connectors" ? `/connectors/${connector.key}/api-key` : "/integrations";
  const body = source === "connectors" ? values : { service: connector.key, ...values, status: "1" };
  const { data } = await api.post(url, body);
  assertEnvelope(data, `Could not connect ${connector.name}`);
  return typeof data?.message === "string" ? data.message : `${connector.name} connected.`;
}

export async function disconnectConnector(connector: Connector, connection: ConnectionState, source: Connections["source"]) {
  if (connector.store === "mail_accounts") return removeAllMailAccounts();
  if (connector.store === "sms_senders") return removeAllSmsSenders();
  if (connector.store === "mailboxes") return removeAllMailboxes();
  if (connector.googleService) return disconnectGoogleService(connector.googleService, connector.name);
  // These delete by record id, so the id has to have come from their own route:
  // the leftover reader's ids belong to another table and would hit the wrong row.
  if (connector.store === "payments" || connector.store === "email_platforms") {
    if (connection.owner !== connector.store) {
      throw new Error(`Couldn't read your ${connector.name} connection just now. Reload and try again.`);
    }
    if (!connection.recordId) throw new Error(`Nothing to disconnect for ${connector.name}.`);
    return connector.store === "payments"
      ? deletePaymentConnection(connection.recordId, connector.name)
      : disconnectEmailPlatform(connection.recordId, connector.name);
  }
  if (connector.store === "platform_apis") {
    const cleared = Object.fromEntries((connector.fields ?? []).map((field) => [field.name, ""]));
    await savePlatformKeys(cleared, `Could not remove ${connector.name}`);
    return `${connector.name} key removed.`;
  }
  if (source === "legacy" && !connection.recordId) throw new Error(`Nothing to disconnect for ${connector.name}.`);
  const url = source === "connectors" ? `/connectors/${connector.key}` : `/integrations/${connection.recordId}`;
  const { data } = await api.delete(url);
  assertEnvelope(data, `Could not disconnect ${connector.name}`);
  return typeof data?.message === "string" ? data.message : `${connector.name} disconnected.`;
}
