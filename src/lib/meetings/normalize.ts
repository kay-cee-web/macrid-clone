import { pickField, toMaybeNumber, toNumber, toText } from "@/lib/api/pick";
import type { Meeting, MeetingAllowance, MeetingStatus } from "@/types/meeting";

/**
 * Readers for the /meetings routes.
 *
 * **Row shape confirmed 2026-09-30** against the first real rows:
 * `{id, title, service, status, note, when, minutes, tokens, people, summary, actions}`.
 *
 * Four of those are not what the doc's prose implied, and each one was a bug
 * until the first row arrived: it is `service` not `platform`, `when` not
 * `starts_at`, `people` is a **count** rather than names, and `actions` is a
 * **count** too — reading it as a list put a literal "0" on screen as if it
 * were an action item. `note` is the failure reason on a failed row.
 *
 * The alternative spellings stay as fallbacks, but the first name in each list
 * is the confirmed one.
 */
type Row = Record<string, unknown>;

const STATUS: Record<string, MeetingStatus> = {
  scheduled: "scheduled", pending: "scheduled", booked: "scheduled", queued: "scheduled",
  joining: "joining", connecting: "joining", starting: "joining",
  recording: "recording", in_call: "recording", in_progress: "recording", live: "recording", active: "recording",
  done: "done", completed: "done", complete: "done", finished: "done", transcribed: "done", summarised: "done",
  failed: "failed", error: "failed",
  cancelled: "cancelled", canceled: "cancelled",
};

function toStatus(value: unknown, problem: string): MeetingStatus {
  const status = STATUS[toText(value).toLowerCase().replace(/[\s-]+/g, "_")];
  if (status) return status;
  // An unknown status with an error on the row is a failure; otherwise assume
  // it is still coming, which is the state that offers Cancel.
  return problem ? "failed" : "scheduled";
}

export function toMeeting(row: Row): Meeting {
  const status = toText(pickField(row, ["status", "state"])).toLowerCase();
  // `note` carries the failure reason on a failed row — the first real rows came
  // back with a Laravel routing error in it. On a row that worked it is a short
  // write-up, so it only becomes `problem` when the meeting actually failed.
  const note = toText(pickField(row, ["note", "last_error", "error", "problem", "failure_reason"]));
  const failed = status === "failed" || status === "error";
  return {
    id: toText(row.id),
    title: toText(pickField(row, ["title", "name", "subject", "topic"])) || "Untitled meeting",
    joinUrl: toText(pickField(row, ["meeting_url", "join_url", "joinUrl", "url", "link"])),
    service: toText(pickField(row, ["service", "platform", "provider_platform"])),
    startsAt: toText(pickField(row, ["when", "starts_at", "start_at", "scheduled_at", "startsAt"])),
    status: toStatus(pickField(row, ["status", "state"]), failed ? note : ""),
    // Charged on what was actually recorded, so this is the number that costs money.
    minutes: toMaybeNumber(pickField(row, ["minutes", "duration_minutes", "duration", "recorded_minutes"])),
    tokens: toMaybeNumber(pickField(row, ["tokens", "tokens_charged", "charged"])),
    people: toMaybeNumber(pickField(row, ["people", "attendees", "participants", "attendee_count"])),
    summary: failed ? "" : toText(pickField(row, ["summary", "write_up"])) || note,
    // A **count**, not a list — the items themselves become tasks and live in the note.
    actionCount: toNumber(pickField(row, ["actions", "action_items", "actionCount"])),
    recordingUrl: toText(pickField(row, ["recording_url", "recordingUrl", "audio_url", "video_url"])),
    problem: failed ? note : "",
  };
}

/**
 * The free-minute allowance, off the envelope rather than a row — it belongs to
 * the account.
 *
 * **Confirmed 2026-09-30:** `GET /meetings` answers
 * `{status, free: {used, total, left}, meetings: []}`, so the block is `free`
 * and the fields are bare `used`/`total`/`left` in minutes. The other spellings
 * are kept as fallbacks. `tokens_per_hour` has never been sent, so the cost of
 * a call past the allowance stays unstated rather than guessed.
 */
export function toAllowance(data: unknown): MeetingAllowance {
  const body = (data ?? {}) as Row;
  const block = (pickField(body, ["free", "allowance", "usage", "limits", "meta"]) ?? body) as Row;
  return {
    freeMinutesLeft: toMaybeNumber(pickField(block, ["left", "free_minutes_left", "minutes_left", "remaining"])),
    freeMinutesTotal: toMaybeNumber(pickField(block, ["total", "free_minutes", "free_minutes_total"])),
    freeMinutesUsed: toMaybeNumber(pickField(block, ["used", "minutes_used", "consumed"])),
    tokensPerHour: toMaybeNumber(pickField(body, ["tokens_per_hour", "token_cost_per_hour", "rate_per_hour"])),
  };
}
