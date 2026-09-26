import { pickField, toText } from "@/lib/api/pick";
import { socialKey } from "@/data/connectors/social";
import type { SocialAccount, SocialKind, SocialPlatform, SocialPost, SocialPostStatus } from "@/types/social";

/**
 * Readers for the /social routes. **No payload has ever been seen** — the
 * routes 500 — so every field is read through a list of likely names and the
 * review note falls back to our own. Tighten these against the first real
 * response rather than trusting them.
 */
type Row = Record<string, unknown>;

const asList = (value: unknown): Row[] => (Array.isArray(value) ? (value as Row[]) : []);

const toStrings = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(toText).filter(Boolean) : toText(value).split(/[,\s]+/).filter(Boolean);

export function toAccount(row: Row): SocialAccount {
  const kind = toText(pickField(row, ["kind", "type"])).toLowerCase();
  return {
    id: toText(row.id),
    platform: socialKey(toText(pickField(row, ["platform", "provider", "network", "service"]))),
    name: toText(pickField(row, ["name", "label", "account_name", "username", "title"])),
    kind: (kind === "ads" ? "ads" : "social") as SocialKind,
    problem: toText(pickField(row, ["last_error", "error", "problem"])),
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
