import { pickField, toBool, toText } from "@/lib/api/pick";
import { socialKey } from "@/data/connectors/social";
import type { SocialAccount, SocialKind, SocialPlatform, SocialPost, SocialPostStatus } from "@/types/social";

/**
 * Readers for the /social routes. Both shapes are confirmed against live
 * payloads (2026-09-26), so the candidate-name lists are belt and braces rather
 * than guesses now.
 */
type Row = Record<string, unknown>;

const asList = (value: unknown): Row[] => (Array.isArray(value) ? (value as Row[]) : []);

const toStrings = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(toText).filter(Boolean) : toText(value).split(/[,\s]+/).filter(Boolean);

/**
 * A connected account, confirmed with a real X grant (2026-09-26):
 * `{id: 1, platform: "x", kind: "social", name: "Okpara Favour | Full-Stack JS",
 * handle: "okparafavour202", avatar, currency: null, can: [...], active: true,
 * problem: null}`.
 *
 * `active: false` is a grant that stopped working — an expired or revoked
 * token — and the row can say that without filling `problem`, so it needs its
 * own wording or the card would keep reading Connected.
 */
export function toAccount(row: Row): SocialAccount {
  const kind = toText(pickField(row, ["kind", "type"])).toLowerCase();
  const off = toBool(pickField(row, ["active", "is_active"]), true) === false;
  const problem = toText(pickField(row, ["last_error", "error", "problem"]));
  return {
    id: toText(row.id),
    platform: socialKey(toText(pickField(row, ["platform", "provider", "network", "service"]))),
    name: toText(pickField(row, ["name", "label", "account_name", "username", "title"])),
    kind: (kind === "ads" ? "ads" : "social") as SocialKind,
    problem: problem || (off ? "Sign in again to keep posting." : ""),
  };
}

/**
 * One platform row, confirmed 2026-09-26:
 * `{platform: "facebook", label: "Facebook Page", kind: "social"|"ads",
 * can: ["text","image",…], needs: "…", connected: []}`.
 *
 * **There is no `connect` field**, which is the machine-readable proof that the
 * consent flow isn't built: nothing tells us where to send the user. It stays
 * in the type so the day it appears, the card can use it.
 */
export function toPlatform(row: Row, fallbackKey = ""): SocialPlatform {
  const key = socialKey(toText(pickField(row, ["platform", "key", "provider", "id", "slug"])) || fallbackKey);
  const kind = toText(pickField(row, ["kind", "type"])).toLowerCase();
  return {
    key,
    name: toText(pickField(row, ["label", "name", "title"])) || key,
    kind: (kind === "ads" ? "ads" : "social") as SocialKind,
    can: toStrings(pickField(row, ["can", "posts", "post_types", "capabilities", "supports"])),
    // Only what the backend says; we keep no copy of a vendor's review rules.
    needs: toText(pickField(row, ["needs", "review", "requirement", "note"])),
    connect: toText(pickField(row, ["connect", "connect_url", "redirect", "auth_url"])),
    accounts: asList(pickField(row, ["connected", "accounts", "connections"])).map(toAccount),
  };
}

const STATUSES: SocialPostStatus[] = ["draft", "scheduled", "publishing", "published", "failed", "deleted"];

export function toPost(row: Row): SocialPost {
  const status = toText(pickField(row, ["status", "state"])).toLowerCase();
  return {
    id: toText(row.id),
    accountId: toText(pickField(row, ["account_id", "accountId", "social_account_id"])),
    platform: socialKey(toText(pickField(row, ["platform", "provider", "network"]))),
    body: toText(pickField(row, ["body", "content", "text", "caption"])),
    media: toStrings(pickField(row, ["media", "media_urls", "images"])),
    status: (STATUSES as string[]).includes(status) ? (status as SocialPostStatus) : "draft",
    publishAt: toText(pickField(row, ["publish_at", "scheduled_at", "publishAt"])),
    problem: toText(pickField(row, ["last_error", "error", "failure_reason", "problem"])),
  };
}
