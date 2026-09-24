import { pickField, toBool, toMaybeNumber, toText } from "@/lib/api/pick";
import { paymentKey } from "@/data/connectors/payments";
import type { ConnectorField } from "@/types/connector";
import type { PaymentConnection, PaymentProvider, PaymentWebhook } from "@/types/payment";

/** Readers for the /payments routes (shapes seen 2026-09-24, read tolerantly all the same). */
type Row = Record<string, unknown>;

const toList = (value: unknown) => (Array.isArray(value) ? value.map(toText).filter(Boolean) : []);

/** Fields as a list of rows, or an object `{secret_key: "Secret key"}`. Secret-looking names become password inputs. */
function toFields(value: unknown): ConnectorField[] {
  const rows: Row[] = Array.isArray(value)
    ? value.map((v) => (typeof v === "string" ? { name: v } : (v as Row)))
    : Object.entries((value ?? {}) as Row).map(([name, label]) => (typeof label === "object" ? { name, ...(label as Row) } : { name, label }));
  return rows.map((row): ConnectorField => {
    const name = toText(pickField(row, ["name", "key", "field"]));
    const secret = /secret|key|token|password/i.test(name) && !/client_id/i.test(name);
    return {
      name,
      label: toText(pickField(row, ["label", "title"])) || name.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
      type: toText(row.type) === "text" || !secret ? "text" : "password",
      required: toBool(row.required, true),
      placeholder: toText(row.placeholder) || undefined,
      help: toText(pickField(row, ["help", "hint", "description"])) || undefined,
    };
  }).filter((f) => f.name);
}

/** `{provider, label, fields: [{name, label}], help}` */
export function toProvider(row: Row): PaymentProvider {
  const apiKey = toText(pickField(row, ["key", "provider", "id", "slug"]));
  return {
    key: paymentKey(apiKey),
    apiKey,
    name: toText(pickField(row, ["label", "name"])) || apiKey,
    fields: toFields(pickField(row, ["fields", "credentials"])),
    help: toText(pickField(row, ["help", "instructions", "where"])),
  };
}

/**
 * `{id, provider, name, live, currency, is_active, last_synced, last_error}`.
 * `name` is the provider's own name ("Stripe"), so the card shows the currency.
 * Whether a webhook secret is saved comes from the webhook route, not this row.
 */
export function toConnection(row: Row): PaymentConnection {
  const status = toText(row.status).toLowerCase();
  const off = toBool(row.is_active, true) === false;
  const broken = off || ["error", "failed", "invalid", "expired", "revoked"].includes(status);
  const secretSet = pickField(row, ["secret_set", "webhook_secret_set", "has_webhook_secret"]);
  return {
    id: toText(row.id),
    provider: paymentKey(toText(pickField(row, ["provider", "service", "key"]))),
    account: toText(pickField(row, ["account", "account_name", "email", "currency"])),
    live: toBool(row.live, true),
    problem: toText(pickField(row, ["last_error", "problem", "error"])) || (broken ? "The key stopped working." : ""),
    webhookReady: secretSet === undefined ? null : toBool(secretSet, false),
    notify: {
      notify_events: toList(row.notify_events),
      notify_channels: toList(row.notify_channels),
      notify_to: toText(row.notify_to),
      notify_min_amount: toMaybeNumber(row.notify_min_amount),
    },
  };
}

/** `{url, secret_set, verified, last_event, steps: [..]}` */
export function toWebhook(body: Row): PaymentWebhook {
  const steps = pickField(body, ["steps", "instructions", "help"]);
  return {
    url: toText(pickField(body, ["url", "webhook_url", "endpoint"])),
    steps: Array.isArray(steps) ? steps.map(toText).filter(Boolean) : toText(steps).split(/\n+/).filter(Boolean),
    secretSet: toBool(body.secret_set, false),
    verified: toBool(body.verified, false),
    lastEvent: toText(pickField(body, ["last_event", "last_event_at"])),
  };
}
