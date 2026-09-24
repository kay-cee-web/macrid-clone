import type { ConnectorField } from "./connector";

/** One provider from GET /payments/providers: what its key form asks for. */
export type PaymentProvider = {
  /** Normalised (`paymentKey`), to match a connector. */
  key: string;
  /** As the backend spells it, for POST /payments/connections. */
  apiKey: string;
  name: string;
  fields: ConnectorField[];
  help: string;
};

export type Notifications = {
  webhook_secret?: string;
  notify_events: string[];
  notify_channels: string[];
  notify_to: string;
  notify_min_amount: number | null;
};

export type PaymentConnection = {
  id: string;
  /** Normalised (`paymentKey`), to match a connector. */
  provider: string;
  account: string;
  live: boolean;
  /** What's broken, or "" when it works. */
  problem: string;
  /** False when a webhook secret is needed and was never saved; null when nothing says. */
  webhookReady: boolean | null;
  notify: Notifications;
};

export type PaymentWebhook = {
  url: string;
  steps: string[];
  /** A signing secret is saved; until then the backend rejects every event. */
  secretSet: boolean;
  /** An event has arrived and passed the signature check. */
  verified: boolean;
  lastEvent: string;
};
