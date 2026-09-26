import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList, toText } from "@/lib/api/pick";
import { toAccount, toPlatform, toPost } from "@/lib/social/normalize";
import type { SocialAccount, SocialKind, SocialPlatform, SocialPost } from "@/types/social";

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

/** `posts` is a Laravel paginator, so the rows are at `posts.data` (seen 2026-09-26). */
export async function fetchSocialPosts(): Promise<SocialPost[]> {
  const { data } = await api.get("/social/posts");
  assertEnvelope(data, "Could not read your posts");
  const posts = (data as Row)?.posts;
  const rows = Array.isArray(posts) ? (posts as Row[]) : pickList<Row>(posts, "data");
  return rows.map(toPost);
}

export async function disconnectSocialAccount(id: string, name: string) {
  const { data } = await api.delete(`/social/accounts/${id}`);
  assertEnvelope(data, `Could not disconnect ${name}`);
  return toText((data as Row)?.message) || `${name} disconnected.`;
}
