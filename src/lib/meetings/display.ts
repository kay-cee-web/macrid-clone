import type { PillTone } from "@/components/ui/Pill";
import { formatDateTime } from "@/lib/format";
import type { Meeting, MeetingStatus } from "@/types/meeting";

/** The word on the right of a row, and how loud it is. */
const LABELS: Record<MeetingStatus, { label: string; tone: PillTone }> = {
  scheduled: { label: "Scheduled", tone: "neutral" },
  joining: { label: "Joining", tone: "accent" },
  recording: { label: "Recording", tone: "bad" },
  done: { label: "Notes ready", tone: "good" },
  failed: { label: "Didn't join", tone: "warn" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

export const statusOf = (meeting: Meeting) => LABELS[meeting.status];

/** Only a bot that hasn't joined can be called off. */
export const canCancel = (meeting: Meeting) => meeting.status === "scheduled" || meeting.status === "joining";

/** Whether this call produced anything to read. The write-up itself lives in Notes. */
export const hasNotes = (meeting: Meeting) =>
  meeting.status === "done" || Boolean(meeting.summary || meeting.actionCount > 0);

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/**
 * "Starting now", "In 10 minutes", "Yesterday, 4:00 PM" — the same three shapes
 * a calendar uses, because the only question a row has to answer at a glance is
 * whether it has happened yet.
 */
export function whenLabel(meeting: Meeting, now = Date.now()): string {
  if (meeting.status === "recording" || meeting.status === "joining") return "Starting now";

  const at = meeting.startsAt ? new Date(meeting.startsAt).getTime() : NaN;
  if (Number.isNaN(at)) return meeting.status === "scheduled" ? "Joining as soon as it starts" : "";

  const ahead = at - now;
  if (ahead > 0) {
    if (ahead < MINUTE) return "Starting now";
    if (ahead < HOUR) return relative.format(Math.round(ahead / MINUTE), "minute");
    if (ahead < 12 * HOUR) return relative.format(Math.round(ahead / HOUR), "hour");
    return formatDateTime(meeting.startsAt);
  }
  return formatDateTime(meeting.startsAt);
}

/**
 * "45 min · 38 tokens" — what it actually cost, once the call is over.
 *
 * The row carries `tokens` outright now, so this states the real charge rather
 * than deriving one from a rate. Nothing is shown before a call has run.
 */
export function costLabel(meeting: Meeting): string {
  const parts: string[] = [];
  if (meeting.minutes !== null) parts.push(`${meeting.minutes} min`);
  if (meeting.tokens) parts.push(`${meeting.tokens} tokens`);
  else if (meeting.minutes !== null && meeting.tokens === 0) parts.push("free");
  return parts.join(" · ");
}
