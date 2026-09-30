import type { BriefingNeed, BriefingToday } from "@/types/briefing";

/**
 * What a briefing button says to the agent.
 *
 * There is no route that clears, snoozes or answers a briefing item, and there
 * shouldn't be: the briefing is recomputed from the records each time, so the
 * only way to make an item go away is to change the thing it is about. That is
 * the agent's job, and it already has the tools — `complete_task`,
 * `update_record`, `move_deal_stage`, `read_inbox`, `send_email`.
 *
 * So every button here writes one sentence and sends it to the chat, where the
 * user watches the agent do it and the work receipt shows what changed. The
 * `ref` the backend ships is what makes the sentence unambiguous.
 */

/** Kinds that stand for a record the agent can actually change. */
const RECORD_KINDS = new Set([
  "task", "deal", "lead", "reply", "contact", "meeting", "appointment", "company", "campaign", "list", "funnel",
]);

/** Kinds where writing a reply is the obvious next move. */
const REPLY_KINDS = new Set(["reply", "lead", "contact", "deal"]);

/**
 * Jira, GitHub and Shopify are read-only by design — the work-tools doc is
 * explicit that nothing writes to them — so a watcher item gets no Handled
 * button. Offering one would clear the card and change nothing, and the item
 * would be back in tomorrow's briefing.
 */
export const canChange = (need: BriefingNeed) => RECORD_KINDS.has(need.kind);
export const canDraft = (need: BriefingNeed) => REPLY_KINDS.has(need.kind);

/** `"Follow up with Ethan" (task 42)` — enough for the agent to find one row. */
function named(need: BriefingNeed): string {
  const what = [need.kind, need.ref].filter(Boolean).join(" ");
  return what ? `"${need.title}" (${what})` : `"${need.title}"`;
}

/** Show me a reply, don't send it. The approval stays with the person. */
export const draftInstruction = (need: BriefingNeed) =>
  `Draft a reply for ${named(need)}. Show me the draft and wait — don't send it.`;

export const handledInstruction = (need: BriefingNeed) =>
  need.kind === "task"
    ? `Mark ${named(need)} complete — I've dealt with it.`
    : `I've dealt with ${named(need)}. Update it so it's no longer outstanding, and tell me what you changed.`;

export const notTodayInstruction = (need: BriefingNeed) =>
  `Push ${named(need)} to tomorrow — move its due date so it stops showing as due today.`;

/** For a watcher item, or any kind we don't recognise: talk about it instead. */
export const askInstruction = (need: BriefingNeed) =>
  `Tell me more about ${named(need)} and what my options are.`;

/**
 * Today's rows carry no id — the payload is `{time, what, sub}` — so the agent
 * is asked to find it by name and confirm. It reports what it changed, and the
 * receipt under the reply is the check on it.
 */
export const todayDoneInstruction = (item: BriefingToday) =>
  `Mark "${item.what}" as done${item.sub ? ` (${item.sub})` : ""}. Confirm what you changed.`;
