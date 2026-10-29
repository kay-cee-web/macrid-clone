import { extractApiError, isTokenExhausted } from "@/lib/api/errors";
import type { ChatImage, ChatMessage, ChatReply } from "@/types/agent";
import type { WorkChange } from "@/types/receipt";

export type ThreadMessage = ChatMessage & {
  /** On a failed turn: what to resend. */
  retry?: { text: string; images: ChatImage[] };
  /** On a failed turn that hit the plan's token limit. */
  outOfTokens?: boolean;
  /** On a reply that rewrote the agent's brief. */
  instructionsUpdated?: boolean;
  /** On replies from this session: what the turn cost and what it changed in Records. */
  usage?: ChatReply["usage"];
  changes?: WorkChange[];
};

/** A client-side id for messages shown before (or instead of) the backend's own. */
export const newMessageId = () =>
  `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const now = () => new Date().toISOString();

export const userMessage = (text: string, images: ChatImage[]): ThreadMessage => ({
  id: newMessageId(),
  role: "user",
  text,
  at: now(),
  ...(images.length ? { images } : {}),
});

export const replyMessage = (id: string, { reply, instructions, usage }: ChatReply): ThreadMessage => ({
  id,
  role: "assistant",
  text: reply || "The agent finished without a written reply.",
  at: now(),
  instructionsUpdated: instructions !== null,
  usage,
});

/** Every AI provider failed (backend guide, 2026-10-29): the message lists each provider's raw error. */
const ALL_PROVIDERS_FAILED = /^AI chat failed/i;
const PROVIDERS_DOWN = "The assistant is unavailable right now. Try again in a minute.";

/** A failed turn, shown inline with a retry (and an upgrade link when tokens ran out). */
export function failureMessage(id: string, err: unknown, retry: ThreadMessage["retry"]): ThreadMessage {
  let text = extractApiError(err, "Could not reach the agent");
  if (ALL_PROVIDERS_FAILED.test(text)) {
    // The provider errors are for us, not the user: keep them in the console.
    console.error(text);
    text = PROVIDERS_DOWN;
  }
  return { id, role: "assistant", text, at: now(), error: true, outOfTokens: isTokenExhausted(text), retry };
}
