import { deleteMailAccount, deleteSmsSender, fetchMailAccounts, fetchSmsSenders } from "@/services/senders";

/** One sender as the manage dialog lists it, whatever kind it is. */
export type SenderRow = { id: string; title: string; detail: string; active: boolean };

type SenderKind = {
  /** "mailbox", "number": what one of them is called. */
  noun: string;
  description: string;
  load: () => Promise<SenderRow[]>;
  remove: (id: string) => Promise<void>;
  /** What removing one costs, in the confirm dialog. */
  removeNote: string;
};

/** The connectors that can hold several senders, by their `store`. */
export const SENDER_KINDS: Record<string, SenderKind> = {
  mail_accounts: {
    noun: "mailbox",
    description: "The SMTP mailboxes your agents send email from.",
    load: async () =>
      (await fetchMailAccounts()).map((a) => ({
        id: a.id,
        title: a.name ? `${a.name} <${a.email}>` : a.email || "Unnamed mailbox",
        detail: [a.host && (a.port ? `${a.host}:${a.port}` : a.host), a.encryption].filter(Boolean).join(" · "),
        active: a.active,
      })),
    remove: deleteMailAccount,
    removeNote: "Agents stop sending from it. Campaigns already sent are kept.",
  },
  sms_senders: {
    noun: "number",
    description: "The Twilio numbers your agents text from.",
    load: async () =>
      (await fetchSmsSenders()).map((s) => ({
        id: s.id,
        title: s.sender || "Unnamed sender",
        detail: s.messages === null ? "" : `${s.messages} message${s.messages === 1 ? "" : "s"} sent`,
        active: s.active,
      })),
    remove: deleteSmsSender,
    removeNote: "Agents stop texting from it. With none left, texts go out on Dexisphere's shared sender.",
  },
};
