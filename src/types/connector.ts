import type { LucideIcon } from "lucide-react";

export type ConnectorCategory = "channel" | "prospect" | "email_platform";

/**
 * oauth     consent popup via the connector's `connect` route
 * api_key   a form of credential fields
 * external  set up inside the main Macrid app (e.g. SMTP mailboxes, Facebook)
 */
export type ConnectorAuth = "oauth" | "api_key" | "external";

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
  Icon: LucideIcon;
  /** OAuth: GET this to receive `auth_url`. */
  connect?: string;
  /** External: path inside the Macrid app where it's managed. */
  manageHref?: string;
  fields?: ConnectorField[];
  /**
   * Where the credentials live when it isn't /connectors or /integrations:
   * platform_apis (Google Places), mail_accounts (SMTP), sms_senders (Twilio).
   * The last two can hold several senders, so they are added, not disconnected.
   */
  store?: "platform_apis" | "mail_accounts" | "sms_senders";
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
