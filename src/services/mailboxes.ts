import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickField, pickList, toBool, toMaybeNumber, toText } from "@/lib/api/pick";

/**
 * Mailboxes: IMAP with an app password, the only way an agent reads mail
 * (Gmail's OAuth connection sends only). The backend tests every mailbox
 * before saving it. No sample payloads shipped, so rows are read tolerantly.
 */
type Row = Record<string, unknown>;

export type MailboxProvider = {
  key: string;
  name: string;
  host: string;
  port: number | null;
  /** How to make an app password, as the backend words it. */
  steps: string[];
  /** Where the app password is made (myaccount.google.com/apppasswords…). */
  helpUrl: string;
  /** Asks for host, port and encryption itself. */
  custom: boolean;
};

export type Mailbox = { id: string; email: string; provider: string; active: boolean; error: string };

export const CUSTOM_PROVIDER = "custom";

function toSteps(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(toText).filter(Boolean);
  return toText(value).split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

/** A bare address in the help text ("…at myaccount.google.com/apppasswords and…"). */
const linkIn = (text: string) => text.match(/\b(?:https?:\/\/)?[\w-]+(?:\.[\w-]+)+\/[\w/.-]*\w/)?.[0] ?? "";

/**
 * Seen 2026-09-23: `{key, label, needs: "app_password"|"host", help, defaults: {host, port, encryption}}`.
 * "custom" is the one that `needs` a host.
 */
function toProvider(row: Row, fallbackKey = ""): MailboxProvider {
  const key = toText(pickField(row, ["key", "provider", "id", "slug"])) || fallbackKey;
  const defaults = (row.defaults ?? {}) as Row;
  const help = pickField(row, ["help", "instructions", "steps"]);
  const steps = toSteps(help);
  return {
    key,
    name: toText(pickField(row, ["label", "name", "title"])) || key,
    host: toText(pickField(defaults, ["host"]) ?? pickField(row, ["host", "imap_host"])),
    port: toMaybeNumber(pickField(defaults, ["port"]) ?? pickField(row, ["port", "imap_port"])),
    steps,
    helpUrl: toText(pickField(row, ["app_password_url", "help_url", "url", "link"])) || linkIn(steps.join(" ")),
    custom: key === CUSTOM_PROVIDER || row.needs === "host" || toBool(row.custom, false),
  };
}

/** The list, or an object keyed by provider. "Custom" is always offered, last. */
export async function fetchMailboxProviders(): Promise<MailboxProvider[]> {
  const { data } = await api.get("/mailboxes/providers");
  assertEnvelope(data, "Could not load the mail providers");
  let providers = pickList<Row>(data, "providers").map((row) => toProvider(row));
  if (!providers.length) {
    const body = ((data as Row)?.providers ?? (data as Row)?.data ?? data) as Row;
    const entries = body && typeof body === "object" ? Object.entries(body) : [];
    providers = entries.filter(([, v]) => v && typeof v === "object").map(([key, v]) => toProvider(v as Row, key));
  }
  const withoutCustom = providers.filter((p) => p.key && !p.custom);
  const custom = providers.find((p) => p.custom) ?? { ...toProvider({}, CUSTOM_PROVIDER), name: "Other (IMAP)" };
  return [...withoutCustom, custom];
}

export async function fetchMailboxes(): Promise<Mailbox[]> {
  const { data } = await api.get("/mailboxes");
  assertEnvelope(data, "Could not load your mailboxes");
  return pickList<Row>(data, "mailboxes").map((row) => ({
    id: toText(row.id),
    email: toText(pickField(row, ["email", "username", "address"])),
    provider: toText(row.provider),
    active: toBool(pickField(row, ["is_active", "active", "status"]), true),
    error: toText(pickField(row, ["last_error", "error"])),
  }));
}

export type MailboxInput = {
  provider: string;
  email: string;
  password: string;
  host?: string;
  port?: string;
  encryption?: string;
  validate_cert?: boolean;
};

/** The backend strips spaces from app passwords and tests the login before saving. */
export async function createMailbox(input: MailboxInput) {
  const custom = input.provider === CUSTOM_PROVIDER;
  const body = custom
    ? { ...input, port: input.port ? Number(input.port) : undefined }
    : { provider: input.provider, email: input.email, password: input.password };
  const { data } = await api.post("/mailboxes", body);
  assertEnvelope(data, "Could not connect the mailbox");
  return toText((data as Row)?.message) || `${input.email} connected.`;
}

export async function testMailbox(id: string) {
  const { data } = await api.post(`/mailboxes/${id}/test`);
  assertEnvelope(data, "The mailbox didn't answer");
  return toText((data as Row)?.message) || "The mailbox is working.";
}

export async function deleteMailbox(id: string) {
  const { data } = await api.delete(`/mailboxes/${id}`);
  assertEnvelope(data, "Could not remove the mailbox");
}

/** Disconnecting the connector removes every mailbox, one at a time. */
export async function removeAllMailboxes() {
  const mailboxes = await fetchMailboxes();
  for (const mailbox of mailboxes) await deleteMailbox(mailbox.id);
  return mailboxes.length === 1 ? "Mailbox removed." : `${mailboxes.length} mailboxes removed.`;
}
