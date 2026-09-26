/**
 * Social publishing and ad reporting (backend doc 2026-09-26). An agent writes
 * the post, makes the image and publishes it, then reads back how it did.
 *
 * **None of it runs yet.** `/social/*` answers 500 — the controller isn't
 * deployed — and the consent flows ("OAuth is still to build") don't exist, so
 * no account can be linked. These shapes are read tolerantly because no real
 * payload has ever been seen; confirm them against the first live response.
 */

/** `social` can post; `ads` is read-only reporting. Both arrive on one grant. */
export type SocialKind = "social" | "ads";

export type SocialAccount = {
  id: string;
  /** Our connector key, so it lines up with the catalogue. */
  platform: string;
  /** The page, profile or ad account's own name. */
  name: string;
  kind: SocialKind;
  /** Set when the grant broke — an expired or revoked token. */
  problem: string;
};

export type SocialPlatform = {
  key: string;
  name: string;
  /** `social` can post; `ads` only reports spend, so it gets no posting card. */
  kind: SocialKind;
  /** `can` from the API: text, image, video, link, carousel, metrics, comments. */
  can: string[];
  /**
   * `needs` from the API: what the platform demands before it will post to
   * anyone else's account. **Ops knowledge, not card copy** — it names scopes
   * and review queues that mean nothing to a user.
   */
  needs: string;
  /** Where consent starts. The API sends no such field yet, so "" today. */
  connect: string;
  accounts: SocialAccount[];
};

/** draft → scheduled → publishing → published, with failed and deleted aside. */
export type SocialPostStatus = "draft" | "scheduled" | "publishing" | "published" | "failed" | "deleted";

export type SocialPost = {
  id: string;
  accountId: string;
  platform: string;
  body: string;
  media: string[];
  status: SocialPostStatus;
  publishAt: string;
  /** Why a failed post failed, in the backend's words. */
  problem: string;
};
