import { isAxiosError } from "axios";
import { api } from "@/lib/api/client";
import { assertEnvelope, extractApiError } from "@/lib/api/errors";
import { applyEmailPlatforms, applyPayments, applySocialAccounts } from "@/lib/connections/ownedAccounts";
import {
  applyGoogleServices, applyMailAccounts, applyMailboxes, applyPlatformRows, applySmsSenders,
} from "@/lib/connections/ownedState";
import { applyLegacyRows, applyModernRows } from "@/lib/connections/readState";
import type { ConnectionState, Connections } from "@/types/connector";
import { fetchEmailPlatforms } from "./emailPlatforms";
import { fetchGoogleServices } from "./googleConnectors";
import { fetchMailboxes } from "./mailboxes";
import { fetchPaymentConnectionsWithWebhooks } from "./payments";
import { fetchMailAccounts, fetchSmsSenders } from "./senders";
import { fetchSocialAccounts } from "./social";

/**
 * Where a connector's status comes from. The backend keeps each family in its
 * own group, so every group below is read on its own and is the last word on
 * its own connectors. /connectors — with /integrations behind it — is the
 * leftover reader, "others": Outlook, Facebook, WhatsApp Business, anything
 * with no group of its own.
 *
 * Order is the whole mechanism: others first, then the groups over the top. A
 * group that answers always wins, because its applier writes every one of its
 * connectors, `disconnected` included — so an old /integrations key row can't
 * leave Mailchimp looking connected when /email-platforms has nothing. A group
 * that *fails* leaves whatever /connectors said, rather than blanking the
 * section, and says why in `problems`.
 *
 * Adding a group — /social next — is one entry here and one applier.
 */
type State = Record<string, ConnectionState>;

type Group = { label: string; run: (state: State) => Promise<void> };

/** Reads the route, then writes its own connectors. `label` finishes "Could not load your …". */
const group = <T>(label: string, read: () => Promise<T>, apply: (state: State, value: T) => void): Group =>
  ({ label, run: async (state) => apply(state, await read()) });

async function readPlatformKeys() {
  const { data } = await api.get("/platform-apis");
  assertEnvelope(data, "Could not read your platform keys");
  return data as unknown;
}

const GROUPS: Group[] = [
  group("email platforms", fetchEmailPlatforms, applyEmailPlatforms),
  // Answers 500 until the backend deploys DexiSocialController, which shows up
  // on the Plugins page as a problem rather than being swallowed.
  group("social accounts", fetchSocialAccounts, applySocialAccounts),
  group("payment accounts", fetchPaymentConnectionsWithWebhooks, applyPayments),
  group("mailboxes", fetchMailboxes, applyMailboxes),
  group("Google connections", fetchGoogleServices, applyGoogleServices),
  group("sending addresses", fetchMailAccounts, applyMailAccounts),
  group("SMS senders", fetchSmsSenders, applySmsSenders),
  group("Google Places key", readPlatformKeys, applyPlatformRows),
];

/** The leftover reader. Returns which path answered, because writes must match it. */
export async function readOthers(state: State, problems: string[]): Promise<Connections["source"]> {
  try {
    const { data } = await api.get("/connectors");
    assertEnvelope(data, "Could not read your connections");
    applyModernRows(state, data);
    return "connectors";
  } catch (err) {
    // A 404 just means the newer route isn't deployed; anything else is worth reporting.
    if (!(isAxiosError(err) && err.response?.status === 404)) {
      problems.push(extractApiError(err, "Could not read your connections"));
    }
    try {
      const { data } = await api.get("/integrations");
      assertEnvelope(data, "Could not read your integrations");
      applyLegacyRows(state, data);
    } catch (legacyErr) {
      problems.push(extractApiError(legacyErr, "Could not read your integrations"));
    }
    return "legacy";
  }
}

/** Every group at once, each overwriting the leftover reader for its own connectors. */
export async function readOwnedGroups(state: State, problems: string[]) {
  const results = await Promise.allSettled(GROUPS.map((entry) => entry.run(state)));
  results.forEach((result, index) => {
    if (result.status !== "rejected") return;
    // Name the group as well as the reason: two groups failing with the same
    // "Server Error" would otherwise be two identical lines saying nothing.
    const label = `Could not load your ${GROUPS[index].label}`;
    const reason = extractApiError(result.reason, label);
    problems.push(reason.startsWith(label) ? reason : `${label} — ${reason}`);
  });
}
