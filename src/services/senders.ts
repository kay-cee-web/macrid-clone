import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList, toText } from "@/lib/api/pick";

/**
 * Outreach senders: SMTP mailboxes and Twilio SMS senders (same routes as
 * Macrid's outreach screens). Mailboxes are listed at /mail-accounts but
 * deleted at /email-accounts/{id}.
 */
type Row = Record<string, unknown>;

export type MailAccount = { id: string; email: string; name: string; host: string };
export type SmsSender = { id: string; sender: string; active: boolean };

export async function fetchMailAccounts(): Promise<MailAccount[]> {
  const { data } = await api.get("/mail-accounts");
  assertEnvelope(data, "Could not load your mailboxes");
  return pickList<Row>(data, "mail_accounts").map((row) => ({
    id: toText(row.id),
    email: toText(row.senderemail) || toText(row.username),
    name: toText(row.sendername),
    host: toText(row.host),
  }));
}

/** Body as Macrid sends it: port as a number, encryption as TLS | SSL | None. */
export async function createMailAccount(values: Record<string, string>) {
  const { data } = await api.post("/mail-accounts", { ...values, port: Number(values.port) });
  assertEnvelope(data, "Could not add the mailbox");
  return typeof data?.message === "string" && data.message ? data.message : "Mailbox added.";
}

export async function deleteMailAccount(id: string) {
  const { data } = await api.delete(`/email-accounts/${id}`);
  assertEnvelope(data, "Could not remove the mailbox");
}

/** `status` "1" is an active sender. Without one, SMS goes out on Macrid's shared sender. */
export async function fetchSmsSenders(): Promise<SmsSender[]> {
  const { data } = await api.get("/sms-senders");
  assertEnvelope(data, "Could not load your SMS senders");
  return pickList<Row>(data, "sms_senders").map((row) => ({
    id: toText(row.id),
    sender: toText(row.sender),
    active: row.status === undefined || ["1", 1, true, "active"].includes(row.status as never),
  }));
}

export async function createSmsSender(values: Record<string, string>) {
  const { data } = await api.post("/sms-senders", { sid: values.sid, auth_token: values.auth_token, sender: values.sender });
  assertEnvelope(data, "Could not add the SMS sender");
  return typeof data?.message === "string" && data.message ? data.message : "SMS sender added.";
}

export async function deleteSmsSender(id: string) {
  const { data } = await api.delete(`/sms-senders/${id}`);
  assertEnvelope(data, "Could not remove the SMS sender");
}

/**
 * Disconnecting SMTP or Twilio removes every sender of that kind (the confirm
 * dialog names them first). One at a time, so a failure stops where it happened.
 */
export async function removeAllMailAccounts() {
  const accounts = await fetchMailAccounts();
  for (const account of accounts) await deleteMailAccount(account.id);
  return accounts.length === 1 ? "Mailbox removed." : `${accounts.length} mailboxes removed.`;
}

export async function removeAllSmsSenders() {
  const senders = await fetchSmsSenders();
  for (const sender of senders) await deleteSmsSender(sender.id);
  return "Twilio disconnected. Texts go out on Dexisphere's shared sender again.";
}
