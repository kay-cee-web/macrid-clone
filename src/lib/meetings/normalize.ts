import { pickField, toMaybeNumber, toText } from "@/lib/api/pick";
import type { Meeting, MeetingAllowance, MeetingStatus } from "@/types/meeting";

/**
 * Readers for the /meetings routes.
 *
 * **Nothing here is confirmed.** The routes answered 404 on 2026-09-30 — the
 * migration is dated the same day and hasn't been run — and the backend doc
 * says outright that "field names are a guess in places" for `duration`,
 * `recording_url` and the transcript shape. So every field is read through a
 * list of plausible names and anything missing degrades to empty rather than
 * throwing. Check this against the first real row and delete the spellings
 * that turn out to be wrong.
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

const toStrings = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((row) => (typeof row === "string" ? row : toText(pickField(row as Row, ["name", "text", "title", "email"]))))
      .filter(Boolean);
  }
  const text = toText(value);
  return text ? text.split(/\s*[\n,;]\s*/).filter(Boolean) : [];
};

export function toMeeting(row: Row): Meeting {
  const problem = toText(pickField(row, ["last_error", "error", "problem", "failure_reason"]));
  return {
    id: toText(row.id),
    title: toText(pickField(row, ["title", "name", "subject", "topic"])) || "Untitled meeting",
    joinUrl: toText(pickField(row, ["join_url", "joinUrl", "meeting_url", "url", "link"])),
    platform: toText(pickField(row, ["platform", "provider_platform", "source"])).toLowerCase(),
    startsAt: toText(pickField(row, ["starts_at", "start_at", "scheduled_at", "start_time", "startsAt"])),
    status: toStatus(pickField(row, ["status", "state"]), problem),
    // Charged on what was actually recorded, so this is the number that costs money.
    minutes: toMaybeNumber(pickField(row, ["duration_minutes", "minutes", "duration", "recorded_minutes"])),
    attendees: toStrings(pickField(row, ["attendees", "participants", "people", "speakers"])),
    summary: toText(pickField(row, ["summary", "notes", "note", "write_up"])),
    actionItems: toStrings(pickField(row, ["action_items", "actions", "actionItems", "tasks"])),
    recordingUrl: toText(pickField(row, ["recording_url", "recordingUrl", "audio_url", "video_url"])),
    problem,
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
