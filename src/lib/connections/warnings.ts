import type { Connector } from "@/types/connector";

/** What disconnecting takes away, said before it happens. */
export function disconnectWarning(connector: Connector, detail: string) {
  const which = detail ? ` (${detail})` : "";
  if (connector.store === "mail_accounts") {
    return `Every mailbox connected here is removed${which}. Agents can't send email from them until you add one again.`;
  }
  if (connector.store === "sms_senders") {
    return `Your Twilio sender is removed${which}, and texts go back out on Dexisphere's shared sender.`;
  }
  if (connector.store === "mailboxes") {
    return `Every mailbox connected here is removed${which}. Agents can't read your mail until you add one again.`;
  }
  if (connector.store === "payments") {
    return `Agents stop seeing ${connector.name} payments and live alerts stop. The webhook link you pasted into ${connector.name} stops working too.`;
  }
  if (connector.googleService) {
    return `Agents lose ${connector.name} straight away. Your other Google connections keep working.`;
  }
  return "Agents lose access to it until you connect it again.";
}
