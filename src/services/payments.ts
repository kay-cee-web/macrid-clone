import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList, pickOne, toText } from "@/lib/api/pick";
import { toConnection, toProvider, toWebhook } from "@/lib/payments/normalize";
import type { Notifications, PaymentConnection, PaymentProvider, PaymentWebhook } from "@/types/payment";

/**
 * The user's own payment accounts, read-only (PAYMENTS.md, 2026-09-24). Keys
 * are tested before saving and never come back. Normalisers are in
 * `lib/payments/normalize.ts`.
 */
type Row = Record<string, unknown>;

export async function fetchPaymentProviders(): Promise<PaymentProvider[]> {
  const { data } = await api.get("/payments/providers");
  assertEnvelope(data, "Could not load the payment providers");
  const list = pickList<Row>(data, "providers");
  const rows = list.length ? list : Object.entries(pickOne<Row>(data, "providers")).map(([key, v]) => ({ key, ...(v as Row) }));
  return rows.map(toProvider);
}

export async function fetchPaymentConnections(): Promise<PaymentConnection[]> {
  const { data } = await api.get("/payments/connections");
  assertEnvelope(data, "Could not read your payment accounts");
  return pickList<Row>(data, "connections").map(toConnection);
}

const messageOf = (data: unknown, fallback: string) => toText((data as Row)?.message) || fallback;

export async function connectPayment(provider: string, credentials: Record<string, string>, live: boolean, name: string) {
  const { data } = await api.post("/payments/connections", { provider, credentials, live });
  assertEnvelope(data, `Could not connect ${name}`);
  return messageOf(data, `${name} connected.`);
}

export async function testPaymentConnection(id: string, name: string) {
  const { data } = await api.post(`/payments/connections/${id}/test`);
  assertEnvelope(data, `${name} didn't answer`);
  return messageOf(data, `${name} is working.`);
}

export async function deletePaymentConnection(id: string, name: string) {
  const { data } = await api.delete(`/payments/connections/${id}`);
  assertEnvelope(data, `Could not disconnect ${name}`);
  return messageOf(data, `${name} disconnected.`);
}

/** The connection's own webhook URL (stable for its life), where to paste it, and whether events arrive. */
export async function fetchPaymentWebhook(id: string): Promise<PaymentWebhook> {
  const { data } = await api.get(`/payments/connections/${id}/webhook`);
  assertEnvelope(data, "Could not load the webhook link");
  return toWebhook(pickOne<Row>(data, "webhook"));
}

/**
 * Connections with `webhookReady` filled in from each one's webhook route,
 * since the list itself doesn't say whether a signing secret was saved. A
 * webhook that can't be read leaves it unknown rather than flagging the card.
 */
export async function fetchPaymentConnectionsWithWebhooks(): Promise<PaymentConnection[]> {
  const connections = await fetchPaymentConnections();
  const hooks = await Promise.allSettled(connections.map((c) => fetchPaymentWebhook(c.id)));
  return connections.map((c, i) => {
    const hook = hooks[i];
    return hook.status === "fulfilled" ? { ...c, webhookReady: hook.value.secretSet } : c;
  });
}

export async function savePaymentNotifications(id: string, body: Notifications) {
  const { data } = await api.post(`/payments/connections/${id}/notifications`, body);
  assertEnvelope(data, "Could not save the alerts");
  return messageOf(data, "Alerts saved.");
}
