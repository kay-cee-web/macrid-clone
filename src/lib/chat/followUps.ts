import { FOLLOW_UPS } from "@/data/followUps";
import { asksForApproval } from "@/lib/agents/approval";
import type { Suggestion } from "@/types/suggestion";
import type { ThreadMessage } from "./conversation";

const LIMIT = 3;

/** The reply ends on a question only the user can answer (a niche, a mailbox, a date). */
const endsOnQuestion = (text: string) => /\?\s*$/.test(text.trim());

/**
 * What to offer under the latest reply, from what its turn was about. None
 * when the turn matches no topic, and none while the agent is waiting on the user (a question, or a draft to approve),
 * since the next message has to be their answer. Anything they've already
 * sent in this thread isn't offered again.
 */
export function followUpsFor(messages: ThreadMessage[]): Suggestion[] {
  const reply = messages.at(-1);
  if (!reply || reply.role !== "assistant" || reply.error) return [];
  if (endsOnQuestion(reply.text) || asksForApproval(reply.text)) return [];

  const asked = messages.at(-2)?.role === "user" ? messages.at(-2)!.text : "";
  const turn = `${asked}\n${reply.text}`;
  const sent = new Set(messages.filter((m) => m.role === "user").map((m) => m.text.trim()));

  return FOLLOW_UPS.filter(([pattern]) => pattern.test(turn))
    .flatMap(([, items]) => items)
    .filter((item) => !sent.has(item.text))
    .slice(0, LIMIT);
}
