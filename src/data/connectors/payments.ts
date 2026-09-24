import { CreditCard, Wallet } from "lucide-react";
import type { Connector, ConnectorField } from "@/types/connector";

/**
 * The user's own payment accounts, read-only (/payments/connections): the
 * agent reads sales and totals, and a webhook alerts the moment money lands.
 * GET /payments/providers sends each one's fields; these are the fallback.
 */
const ALERTS = "Alerts arrive the moment a payment lands.";

const secret = (help: string): ConnectorField[] => [
  { name: "secret_key", label: "Secret key", type: "password", required: true, help },
];
const apiKey = (help: string): ConnectorField[] => [
  { name: "api_key", label: "API key", type: "password", required: true, help },
];

const payment = (c: Omit<Connector, "category" | "auth" | "store">): Connector => ({
  ...c, category: "payments", auth: "api_key", store: "payments", description: `${c.description} ${ALERTS}`,
});

export const PAYMENT_CONNECTORS: Connector[] = [
  payment({
    key: "stripe", name: "Stripe", Icon: CreditCard, logo: "stripe",
    description: "Pull payments, refunds and payouts, and get alerted in real time.",
    fields: secret("Developers → API keys. A restricted key with read access to balance, charges and customers."),
  }),
  payment({
    key: "paypal", name: "PayPal", Icon: Wallet, logo: "paypal",
    description: "Read transactions and disputes from your PayPal balance.",
    fields: [
      { name: "client_id", label: "Client ID", type: "text", required: true },
      {
        name: "client_secret", label: "Client secret", type: "password", required: true,
        help: "Apps & Credentials. The app needs Transaction Search turned on.",
      },
    ],
  }),
  payment({
    key: "paystack", name: "Paystack", Icon: CreditCard,
    description: "Naira payments, refunds and settlements as they happen.",
    fields: secret("Settings → API Keys & Webhooks. The secret key, not the public one."),
  }),
  payment({
    key: "flutterwave", name: "Flutterwave", Icon: CreditCard,
    description: "Multi-currency payments across Africa, in one feed.",
    fields: secret("Settings → API. The secret key, not the public or encryption key."),
  }),
  payment({
    key: "paddle", name: "Paddle", Icon: CreditCard, logo: "paddle",
    description: "Subscription revenue, renewals and refunds.",
    fields: apiKey("Developer tools → Authentication. Paddle Billing, not Classic."),
  }),
  payment({
    key: "lemonsqueezy", name: "Lemon Squeezy", Icon: CreditCard, logo: "lemonsqueezy",
    description: "Orders, subscriptions and refunds from your store.",
    fields: apiKey("Settings → API."),
  }),
];

/** Paddle and PayPal have a sandbox; `live: false` points them at it. */
export const HAS_SANDBOX = ["paddle", "paypal"];

/** Paystack signs its webhooks with the secret key already saved, so it needs no extra secret. */
export const SIGNS_WITH_KEY = ["paystack"];

/**
 * Every provider's events map onto one set, so a rule behaves the same
 * everywhere. `other` is left out: nobody asks to be told about it.
 */
export const PAYMENT_EVENTS: { value: string; label: string }[] = [
  { value: "payment.success", label: "Payments received" },
  { value: "payment.failed", label: "Failed payments" },
  { value: "refund", label: "Refunds" },
  { value: "dispute", label: "Disputes" },
  { value: "subscription.created", label: "New subscriptions" },
  { value: "subscription.cancelled", label: "Cancelled subscriptions" },
  { value: "subscription.payment_failed", label: "Failed renewals" },
  { value: "payout", label: "Payouts" },
];

export const DEFAULT_PAYMENT_EVENTS = ["payment.success", "refund", "dispute"];

/** "Lemon Squeezy", "lemon_squeezy" and "lemonsqueezy" are the same provider. */
export const paymentKey = (raw: string) => raw.toLowerCase().replace(/[^a-z]/g, "");
