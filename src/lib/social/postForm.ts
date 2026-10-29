import type { PostDraft } from "@/services/social";

/** What happens on save: kept as a draft, sent at a time, or queued now (create only). */
export type PostTiming = "draft" | "schedule" | "now";

export type PostFormValues = { body: string; media: string; link: string; timing: PostTiming; when: string };

/** The backend's limits (DexiSocialController::store). */
export const POST_LIMITS = { body: 5000, media: 10 };

/** An ISO time as a `datetime-local` value in the viewer's own zone. */
export function toLocalInput(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

/** The form as the API wants it; the browser's local time goes out as UTC. */
export function toDraft(values: PostFormValues): PostDraft {
  return {
    body: values.body.trim(),
    media: values.media.split(/\s+/).map((url) => url.trim()).filter(Boolean),
    link: values.link.trim() || null,
    publish_at: values.timing === "schedule" && values.when ? new Date(values.when).toISOString() : null,
  };
}

/** A check the backend would make anyway, said before the round trip; "" when fine. */
export function problemWith(values: PostFormValues, accounts: number, creating: boolean) {
  const draft = toDraft(values);
  if (creating && accounts === 0) return "Pick at least one account to post to.";
  if (!draft.body && !draft.media.length) return "Write something or add an image.";
  if (draft.body.length > POST_LIMITS.body) return `Keep it under ${POST_LIMITS.body.toLocaleString()} characters.`;
  if (draft.media.length > POST_LIMITS.media) return `Up to ${POST_LIMITS.media} images per post.`;
  if (values.timing === "schedule" && !values.when) return "Choose when it should go out.";
  return "";
}
