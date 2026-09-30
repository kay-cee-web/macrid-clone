import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList, pickOne, toText } from "@/lib/api/pick";
import { toAllowance, toMeeting } from "@/lib/meetings/normalize";
import type { Meeting, MeetingAllowance } from "@/types/meeting";

/**
 * The /meetings routes (backend doc 2026-09-30).
 *
 * **Live, confirmed 2026-09-30.** `GET /meetings` answers
 * `{status, free: {used, total, left}, meetings: []}`. The row shape is still
 * unseen — no meeting has been recorded — so `toMeeting` stays tolerant.
 *
 * `POST /webhooks/meetings/{meeting}/{token}` is the vendor's, never ours.
 */
type Row = Record<string, unknown>;

const messageOf = (data: unknown, fallback: string) => toText((data as Row)?.message) || fallback;

export async function fetchMeetings(): Promise<{ meetings: Meeting[]; allowance: MeetingAllowance }> {
  const { data } = await api.get("/meetings");
  assertEnvelope(data, "Could not load your meetings");
  return {
    meetings: pickList<Row>(data, "meetings").map(toMeeting),
    allowance: toAllowance(data),
  };
}

export async function fetchMeeting(id: string): Promise<Meeting> {
  const { data } = await api.get(`/meetings/${id}`);
  assertEnvelope(data, "Could not load that meeting");
  return toMeeting(pickOne<Row>(data, "meeting"));
}

export type NotetakerRequest = {
  /** The Zoom, Meet or Teams link. The bot is pointed at this. */
  meetingUrl: string;
  /** ISO time to join at. Omitted means join now. */
  startsAt?: string;
  title?: string;
};

/**
 * Send the notetaker. **This spends money** — the bot joins a real call and the
 * recording is billed by the minute — so it is only ever called from a deliberate
 * click that has already stated the cost.
 *
 * The allowance is checked server-side before the bot is created, so a refusal
 * here means nothing was sent and nothing was charged.
 */
export async function sendNotetaker(request: NotetakerRequest): Promise<string> {
  // The field is **`meeting_url`** — confirmed by the 422 an empty body returns
  // ("The meeting url field is required."). `join_url` is silently ignored.
  const { data } = await api.post("/meetings", {
    meeting_url: request.meetingUrl,
    ...(request.startsAt ? { starts_at: request.startsAt } : {}),
    ...(request.title ? { title: request.title } : {}),
  });
  assertEnvelope(data, "Could not send the notetaker");
  return messageOf(data, "Notetaker booked.");
}

/** Call off a bot that hasn't joined yet. */
export async function cancelMeeting(id: string): Promise<string> {
  const { data } = await api.post(`/meetings/${id}/cancel`, {});
  assertEnvelope(data, "Could not cancel that notetaker");
  return messageOf(data, "Notetaker cancelled.");
}

/**
 * Book the notetaker for everything already on the calendar.
 *
 * Deliberately a button and never a background job: the doc is explicit that a
 * notetaker turning up at a meeting the user didn't expect is the worst thing
 * this feature can do. It also books several bots at once, so the confirm says
 * how that is billed before it runs.
 */
export async function coverUpcoming(): Promise<string> {
  const { data } = await api.post("/meetings/cover", {});
  assertEnvelope(data, "Could not cover your upcoming meetings");
  return messageOf(data, "Notetaker booked for your upcoming meetings.");
}
