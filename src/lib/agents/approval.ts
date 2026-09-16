/**
 * "Ask before sending". The backend has no approval queue, so the rule lives in
 * the agent's instructions, between two marker lines. The agent reads it on
 * every turn; the switch is on while the markers are there. A chat turn can
 * rewrite instructions, so the state is always read back from the text.
 */
const START = "[Approval rule]";
const END = "[/Approval rule]";

export const APPROVAL_RULE = [
  START,
  "Before any send_email, send_sms or send_whatsapp call, and before launching or scheduling a campaign:",
  "1. Show me the full draft (subject and body, or the message).",
  "2. Say who receives it: the list or recipients, and how many.",
  "3. For email, run verify_emails and check_email_copy first and tell me the results.",
  'Then stop and wait. Send only after I reply "send" (or clearly approve) in this conversation.',
  END,
].join("\n");

const BLOCK = /\n*\[Approval rule\][\s\S]*?\[\/Approval rule\]\n*/g;

export const hasApprovalRule = (instructions: string) => instructions.includes(START) && instructions.includes(END);

export function withApprovalRule(instructions: string, on: boolean) {
  const base = instructions.replace(BLOCK, "\n\n").trim();
  return on ? `${base}${base ? "\n\n" : ""}${APPROVAL_RULE}` : base;
}

/** The reply is waiting for a go-ahead: the rule is on and the agent asked for approval. */
export const asksForApproval = (reply: string) =>
  /\b(reply|say|type)\s+["“']?send["”']?|\bshall i send\b|\bready to send\b|\bapprove\b/i.test(reply);
