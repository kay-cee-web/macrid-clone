import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { fetchPage } from "@/lib/api/paginate";
import { pickList, toText } from "@/lib/api/pick";
import { toAccount, toPlatform, toPost } from "@/lib/social/normalize";
import type { SocialAccount, SocialKind, SocialPlatform } from "@/types/social";

/**
 * /social owns the six publishing platforms and their ad accounts.
 *
 * **Every route below answers 500 today** — `Target class [DexiSocialController]
 * does not exist` — so this layer exists to be ready, and to make the gap
 * visible on the Plugins page rather than hiding it. Reads are wired into the
 * connection groups; writes wait until an account can exist to write about.
 */
type Row = Record<string, unknown>;

/** Capabilities, outstanding review and connected accounts, from one route. */
export async function fetchSocialPlatforms(): Promise<SocialPlatform[]> {
  const { data } = await api.get("/social/platforms");
  assertEnvelope(data, "Could not load the social platforms");
  const list = pickList<Row>(data, "platforms");
  if (list.length) return list.map((row) => toPlatform(row));
  // Or an object keyed by platform, the way /payments/providers can answer.
  const body = ((data as Row)?.platforms ?? (data as Row)?.data ?? {}) as Row;
  return Object.entries(body)
    .filter(([, value]) => value && typeof value === "object" && !Array.isArray(value))
    .map(([key, value]) => toPlatform(value as Row, key));
}

export async function fetchSocialAccounts(kind?: SocialKind): Promise<SocialAccount[]> {
  const { data } = await api.get("/social/accounts", { params: kind ? { kind } : undefined });
  assertEnvelope(data, "Could not read your social accounts");
  return pickList<Row>(data, "accounts").map(toAccount);
}

export type PostFilters = { account_id: string; platform: string; status: string };

/**
 * `GET /social/posts?account_id=&platform=&status=` — a Laravel paginator at
 * `posts` (seen 2026-09-26; filters accepted 2026-10-29). Empty filters are left out.
 */
export async function fetchSocialPosts(filters: PostFilters) {
  const page = await fetchPage("/social/posts", "posts", filters, "Could not read your posts");
  return { ...page, rows: page.rows.map(toPost) };
}

export async function disconnectSocialAccount(id: string, name: string) {
  const { data } = await api.delete(`/social/accounts/${id}`);
  assertEnvelope(data, `Could not disconnect ${name}`);
  return toText((data as Row)?.message) || `${name} disconnected.`;
}

/** `POST /social/posts/{id}/publish`: queues a draft or scheduled post; it goes out within the minute. */
export async function publishSocialPost(id: string) {
  const { data } = await api.post(`/social/posts/${id}/publish`);
  assertEnvelope(data, "Could not publish that post");
  return toText((data as Row)?.message) || "Queued to publish.";
}

/** `DELETE /social/posts/{id}`: only a post that isn't live yet; a published one answers 422 with why. */
export async function deleteSocialPost(id: string) {
  const { data } = await api.delete(`/social/posts/${id}`);
  assertEnvelope(data, "Could not delete that post");
  return toText((data as Row)?.message) || "Deleted.";
}

export type PostDraft = {
  body: string;
  /** Up to 10 hosted image URLs. */
  media: string[];
  link: string | null;
  /** ISO time to schedule for, or null for a draft. */
  publish_at: string | null;
};

/**
 * `POST /social/posts {account_ids, body, media, link, publish_at, publish_now}`:
 * one post per account, so each can fail or be retried alone. Answers
 * `{status, message: "2 post(s) saved." | "… queued to publish.", posts}`;
 * a past time is refused with 422 "That time has already passed.".
 */
export async function createSocialPost(accountIds: string[], draft: PostDraft, publishNow: boolean) {
  const { data } = await api.post("/social/posts", {
    ...draft,
    account_ids: accountIds.map(Number),
    publish_now: publishNow,
  });
  assertEnvelope(data, "Could not save the post");
  return toText((data as Row)?.message) || "Post saved.";
}

/**
 * `PUT /social/posts/{id}`: a draft or scheduled post only (a live one is a 422
 * saying why). Answers `{status, post}` with no message.
 */
export async function updateSocialPost(id: string, draft: PostDraft) {
  const { data } = await api.put(`/social/posts/${id}`, draft);
  assertEnvelope(data, "Could not save the post");
  return toText((data as Row)?.message);
}
