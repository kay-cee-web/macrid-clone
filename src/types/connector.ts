import type { LucideIcon } from "lucide-react";
import type { ChannelProvider } from "./channel";

/**
 * The Plugins page's groups, by who makes the service (Google, Microsoft) or
 * what it's for. `planned` is the "Coming soon" shelf: connectors a workflow
 * needs that nothing on the backend connects yet.
 */
export type ConnectorCategory =
  | "google" | "microsoft" | "mailbox" | "messaging" | "payments" | "sending" | "prospect" | "email_platform" | "planned";

/**
 * oauth     consent popup via the connector's `connect` route
 * api_key   a form of credential fields
 * external  set up inside the main Macrid app (e.g. WhatsApp Business, Facebook)
 * channel   one agent's chat link (WhatsApp, Telegram), paired in its settings
 * planned   no route yet; listed so the gap is visible until the backend builds it
 */
export type ConnectorAuth = "oauth" | "api_key" | "external" | "channel" | "planned";

export type ConnectorField = {
  name: string;
  label: string;
  type: "text" | "password" | "number" | "email" | "select";
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
};

export type Connector = {
  key: string;
  name: string;
  category: ConnectorCategory;
  auth: ConnectorAuth;
  /** What the user gets, in under about 60 characters. Never the scope it needs. */
  description: string;
  /** Drawn when there's no `logo`: SMTP, a bank, anything with no brand of its own. */
  Icon: LucideIcon;
  /** The brand mark's file name in `public/logos`, without `.svg`. */
  logo?: string;
  /** OAuth: GET this to receive `auth_url`. */
  connect?: string;
  /**
   * A Google service (`?service=` on the redirect). Its status comes from
   * /connectors/google/services and it disconnects through /connectors/google/disconnect.
   */
  googleService?: string;
  /** Channel: the provider in /agents/{id}/{provider}/…. */
  channel?: ChannelProvider;
  /** External: path inside the Macrid app where it's managed. */
  manageHref?: string;
  fields?: ConnectorField[];
  /**
   * The group that owns this connector, when it isn't /connectors or
   * /integrations: platform_apis (Google Places), mail_accounts (SMTP),
   * sms_senders (Twilio), mailboxes (IMAP, for reading mail), payments
   * (/payments/connections), email_platforms (/email-platforms). That route is
   * the last word on its status and takes its writes — see
   * `services/connectionSources.ts`.
   *
   * mail_accounts, sms_senders and mailboxes can hold several, so they are
   * added one by one; disconnecting removes them all.
   */
  store?: "platform_apis" | "mail_accounts" | "sms_senders" | "mailboxes" | "payments" | "email_platforms";
  optional?: boolean;
};

/**
 * connected     working
 * attention     set up but broken: an expired token, a revoked app password,
 *               a webhook secret never set. `detail` says what.
 * disconnected  nothing set up
 * unknown       no endpoint says
 */
export type ConnectionState = {
  status: "connected" | "attention" | "disconnected" | "unknown";
  recordId: string | null;
  /** Account email, list id, key hint… or, for `attention`, the problem. */
  detail: string;
  /**
   * The group that wrote this, when its own route answered ("google" for the
   * Google services, otherwise the `store`). Left unset by /connectors and
   * /integrations. A delete that goes by `recordId` must check it: ids from the
   * leftover reader belong to another table, so deleting by one would hit the
   * wrong row.
   */
  owner?: Connector["store"] | "google";
};

export type Connections = {
  /** Which read path answered; writes must use the matching routes. */
  source: "connectors" | "legacy";
  state: Record<string, ConnectionState>;
  problems: string[];
};

/** Set up, working or not: what "Disconnect" and "Manage" act on. */
export const isSetUp = (state: ConnectionState | undefined) =>
  state?.status === "connected" || state?.status === "attention";
