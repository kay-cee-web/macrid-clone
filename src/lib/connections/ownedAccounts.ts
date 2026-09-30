import { CONNECTORS } from "@/data/connectors";
import { SIGNS_WITH_KEY } from "@/data/connectors/payments";
import type { EmailPlatformConnection } from "@/types/emailPlatform";
import type { PaymentConnection } from "@/types/payment";
import type { SocialAccount } from "@/types/social";
import type { WorkToolConnection } from "@/types/workTool";
import { writer, type State } from "./ownedState";

/**
 * The groups that are somebody else's account rather than a credential of ours:
 * a payment provider, an email platform, a social profile. Each reads one
 * dedicated route and is the last word on its own connectors, following the two
 * rules in `ownedState.ts` — write every connector you own, and stamp `owner`.
 */

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

/**
 * GET /social/accounts. One card per platform, standing for its first profile;
 * the ad account that rides along on the same grant is read-only and gets no
 * card. A profile whose token expired needs attention.
 */
/**
 * GET /work-tools. One card per tool, standing for its first connection.
 *
 * Only a reported `problem` puts a card on Needs attention. A watcher with no
 * notify channel would also be broken, but the backend rejects that at save
 * time, and the field we read it from is still a guess — deriving a badge from
 * it would mark every healthy watcher broken the day the guess is wrong.
 */
export function applyWorkTools(state: State, connections: WorkToolConnection[]) {
  const set = writer(state, "work_tools");
  for (const connector of CONNECTORS.filter((c) => c.store === "work_tools")) {
    const first = connections.find((c) => c.provider === connector.key);
    if (!first) {
      set(connector.key, { status: "disconnected", recordId: null, detail: "" });
      continue;
    }
    const reports = first.mode === "watch" && first.notifyChannel ? `Reports to ${first.notifyChannel}` : "";
    set(connector.key, {
      status: first.problem ? "attention" : "connected",
      recordId: first.id,
      detail: first.problem || first.account || reports,
    });
  }
}

export function applySocialAccounts(state: State, accounts: SocialAccount[]) {
  const set = writer(state, "social");
  const profiles = accounts.filter((account) => account.kind === "social");
  for (const connector of CONNECTORS.filter((c) => c.store === "social")) {
    const mine = profiles.filter((account) => account.platform === connector.key);
    const first = mine[0];
    if (!first) {
      set(connector.key, { status: "disconnected", recordId: null, detail: "" });
      continue;
    }
    const more = mine.length > 1 ? ` +${mine.length - 1} more` : "";
    set(connector.key, {
      status: first.problem ? "attention" : "connected",
      recordId: first.id,
      detail: first.problem || `${first.name}${more}`,
    });
  }
}
