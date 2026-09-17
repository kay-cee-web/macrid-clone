import { isAxiosError } from "axios";
import { api } from "@/lib/api/client";
import { assertEnvelope, extractApiError } from "@/lib/api/errors";
import { applyLegacyRows, applyModernRows, applyPlatformRows, blankState, readRows } from "@/lib/connections/readState";
import type { Connections, ConnectionState, Connector } from "@/types/connector";
import { createMailAccount, createSmsSender, fetchMailAccounts, fetchSmsSenders } from "./senders";

/**
 * Workspace connections (shared by every agent). /connectors is the newer
 * route and may 404; /integrations is the legacy one. Google Places keys are
 * always in /platform-apis; SMTP mailboxes and Twilio senders have their own
 * routes. Writes must go to the routes of whichever read answered.
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

/** Senders are the source of truth for SMTP and SMS, whatever /connectors says. */
async function readSenders(state: Record<string, ConnectionState>, problems: string[]) {
  const [mail, sms] = await Promise.allSettled([fetchMailAccounts(), fetchSmsSenders()]);
  if (mail.status === "fulfilled") {
    const emails = mail.value.map((account) => account.email).filter(Boolean);
    const detail = emails.length > 1 ? `${emails[0]} +${emails.length - 1} more` : emails[0] ?? "";
    state.smtp = { status: mail.value.length ? "connected" : "disconnected", recordId: mail.value[0]?.id ?? null, detail };
  } else problems.push(extractApiError(mail.reason, "Could not load your mailboxes"));
  if (sms.status === "fulfilled") {
    const active = sms.value.filter((sender) => sender.active);
    state.twilio = { status: active.length ? "connected" : "disconnected", recordId: active[0]?.id ?? null, detail: active.map((s) => s.sender).join(", ") };
  } else problems.push(extractApiError(sms.reason, "Could not load your SMS senders"));
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

  await Promise.all([readPlatformKeys(state, problems), readSenders(state, problems)]);
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
