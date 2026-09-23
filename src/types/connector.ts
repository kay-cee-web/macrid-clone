import type { LucideIcon } from "lucide-react";

/** `planned` is the "Coming soon" shelf: connectors a workflow needs that nothing on the backend connects yet. */
export type ConnectorCategory = "channel" | "workspace" | "prospect" | "email_platform" | "planned";

/**
 * oauth     consent popup via the connector's `connect` route
 * api_key   a form of credential fields
 * external  set up inside the main Macrid app (e.g. SMTP mailboxes, Facebook)
 * planned   no route yet; listed so the gap is visible until the backend builds it
 */
export type ConnectorAuth = "oauth" | "api_key" | "external" | "planned";

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
  /** External: path inside the Macrid app where it's managed. */
  manageHref?: string;
  fields?: ConnectorField[];
  /**
   * Where the credentials live when it isn't /connectors or /integrations:
   * platform_apis (Google Places), mail_accounts (SMTP), sms_senders (Twilio),
   * mailboxes (IMAP, for reading mail). The last three can hold several, so
   * they are added one by one; disconnecting removes them all.
   */
  store?: "platform_apis" | "mail_accounts" | "sms_senders" | "mailboxes";
  optional?: boolean;
};

export type ConnectionState = {
  status: "connected" | "disconnected" | "unknown";
  recordId: string | null;
  /** Account email, list id, key hint… */
  detail: string;
};

export type Connections = {
  /** Which read path answered; writes must use the matching routes. */
  source: "connectors" | "legacy";
  state: Record<string, ConnectionState>;
  problems: string[];
};
