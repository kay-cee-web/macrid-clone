import type { PillTone } from "@/components/ui/Pill";

/** "not_contacted" / "NOT_CONTACTED" / "in progress" → "Not contacted". */
export function statusLabel(status: string): string {
  const words = status.trim().replace(/[_-]+/g, " ").toLowerCase();
  if (!words) return "";
  if (words === "active") return "Not contacted";
  return words[0].toUpperCase() + words.slice(1);
}

const GOOD = ["sent", "delivered", "completed", "confirmed", "closed", "closing won", "won", "booked", "contacted"];
const BAD = ["failed", "cancelled", "canceled", "no show", "closing lost", "lost", "invalid"];
const WARN = ["pending", "scheduled", "in progress", "sending", "processing", "queued", "draft"];

/** Pill tone for any Macrid status string; unknown values stay neutral. */
export function statusTone(status: string): PillTone {
  const label = statusLabel(status).toLowerCase();
  if (GOOD.includes(label)) return "good";
  if (BAD.includes(label)) return "bad";
  if (WARN.includes(label)) return "warn";
  return "neutral";
}

/** Deal stages, in pipeline order. Fixed in Macrid's frontend. */
export const DEAL_STAGES = ["Prospecting", "Qualification", "Proposal", "Negotiation", "Closing Won", "Closing Lost"];
