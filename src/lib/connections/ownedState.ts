import { CONNECTORS } from "@/data/connectors";
import { SIGNS_WITH_KEY } from "@/data/connectors/payments";
import type { GoogleService } from "@/services/googleConnectors";
import type { Mailbox } from "@/services/mailboxes";
import type { MailAccount, SmsSender } from "@/services/senders";
import type { ConnectionState } from "@/types/connector";
import type { EmailPlatformConnection } from "@/types/emailPlatform";
import type { PaymentConnection } from "@/types/payment";
import { readRows } from "./readState";

/**
 * The groups that own themselves: each applier reads one dedicated route and is
 * the last word on its own connectors (see `services/connectionSources.ts`).
 *
 * Two rules every applier keeps:
 * - It writes **every** connector it owns, `disconnected` included, so a stale
 *   /connectors row can't leave a card looking connected.
 * - It stamps `owner`, which is what makes its `recordId` safe to delete by.
 */
type State = Record<string, ConnectionState>;

/** A writer bound to one group, so nothing it sets can miss the stamp. */
const writer = (state: State, owner: ConnectionState["owner"]) =>
  (key: string, value: Omit<ConnectionState, "owner">) => {
    state[key] = { ...value, owner };
  };

/** GET /connectors/google/services: the one source for every Google card. */
export function applyGoogleServices(state: State, services: GoogleService[]) {
  const set = writer(state, "google");
  for (const connector of CONNECTORS.filter((c) => c.googleService)) {
    const found = services.find((s) => s.service === connector.googleService);
    if (!found) continue;
    // A granted service that reports an error (an expired or revoked token) needs attention.
    const status = found.connected ? (found.error ? "attention" : "connected") : "disconnected";
    set(connector.key, { status, recordId: null, detail: found.error || found.email });
  }
}

/** GET /mailboxes: connected once one works; saved ones that all fail (a revoked app password) need attention. */
export function applyMailboxes(state: State, mailboxes: Mailbox[]) {
  const set = writer(state, "mailboxes");
  const active = mailboxes.filter((m) => m.active);
  const emails = active.map((m) => m.email).filter(Boolean);
  if (!active.length && mailboxes.length) {
    const first = mailboxes[0];
    set("mailbox", { status: "attention", recordId: first.id, detail: first.error || `${first.email} stopped signing in` });
    return;
  }
  set("mailbox", {
    status: active.length ? "connected" : "disconnected",
    recordId: active[0]?.id ?? null,
    detail: emails.length > 1 ? `${emails[0]} +${emails.length - 1} more` : emails[0] ?? "",
  });
}

/**
 * GET /payments/connections: one card per provider, standing for its first
 * account. A broken key, or a webhook secret never saved, needs attention.
 */
export function applyPayments(state: State, connections: PaymentConnection[]) {
  const set = writer(state, "payments");
  for (const connector of CONNECTORS.filter((c) => c.store === "payments")) {
    const mine = connections.filter((c) => c.provider === connector.key);
    const first = mine[0];
    if (!first) {
      set(connector.key, { status: "disconnected", recordId: null, detail: "" });
      continue;
    }
    const secretMissing = first.webhookReady === false && !SIGNS_WITH_KEY.includes(connector.key);
    const problem = first.problem || (secretMissing ? "Webhook secret not set, so live alerts can't arrive." : "");
    const more = mine.length > 1 ? ` +${mine.length - 1} more` : "";
    set(connector.key, {
      status: problem ? "attention" : "connected",
      recordId: first.id,
      detail: problem || `${first.account}${first.live ? "" : " · sandbox"}${more}`,
    });
  }
}

/** GET /mail-accounts: the SMTP senders, which can be several. */
export function applyMailAccounts(state: State, accounts: MailAccount[]) {
  const emails = accounts.map((account) => account.email).filter(Boolean);
  writer(state, "mail_accounts")("smtp", {
    status: accounts.length ? "connected" : "disconnected",
    recordId: accounts[0]?.id ?? null,
    detail: emails.length > 1 ? `${emails[0]} +${emails.length - 1} more` : emails[0] ?? "",
  });
}

/** GET /sms-senders: only an active sender counts as connected. */
export function applySmsSenders(state: State, senders: SmsSender[]) {
  const active = senders.filter((sender) => sender.active);
  writer(state, "sms_senders")("twilio", {
    status: active.length ? "connected" : "disconnected",
    recordId: active[0]?.id ?? null,
    detail: active.map((sender) => sender.sender).join(", "),
  });
}

/** GET /platform-apis: Google Places lives here, not in /connectors. */
export function applyPlatformRows(state: State, payload: unknown) {
  const rows = readRows(payload);
  if (!rows.length) return;
  const withKey = rows.find((row) => row.google_place_api_key);
  const row = withKey ?? rows[0];
  writer(state, "platform_apis")("google_places", {
    status: withKey ? "connected" : "disconnected",
    recordId: row.id === undefined || row.id === null ? null : String(row.id),
    detail: withKey ? "Your own key, no daily limit" : "",
  });
}

/**
 * GET /email-platforms. A saved key with no list chosen yet needs attention: it
 * is connected but can't push or pull until a target is picked, the same call as
 * a payment account with no webhook secret. Systeme.io is exempt — it groups
 * contacts by tag and needs no list.
 */
export function applyEmailPlatforms(state: State, connections: EmailPlatformConnection[]) {
  const set = writer(state, "email_platforms");
  for (const connector of CONNECTORS.filter((c) => c.store === "email_platforms")) {
    const first = connections.find((c) => c.platform === connector.key);
    if (!first) {
      set(connector.key, { status: "disconnected", recordId: null, detail: "" });
      continue;
    }
    const needsList = !first.listless && !first.listId;
    const problem = first.problem || (needsList ? `No ${first.listWord} chosen yet, so nothing can sync.` : "");
    set(connector.key, {
      status: problem ? "attention" : "connected",
      recordId: first.id,
      detail: problem || first.listName || `Syncing one ${first.listWord}`,
    });
  }
}
