import { toMaybeNumber, toText } from "@/lib/api/pick";
import type { Appointment, EmailCampaign, SmsCampaign } from "@/types/records";

type Row = Record<string, unknown>;

const textOrNull = (value: unknown) => toText(value) || null;

function durationOf(row: Row): number | null {
  const given = toMaybeNumber(row.duration) ?? toMaybeNumber(row.duration_minutes);
  if (given !== null) return given;
  const start = new Date(toText(row.start_at)).getTime();
  const end = new Date(toText(row.end_at)).getTime();
  return Number.isNaN(start) || Number.isNaN(end) ? null : Math.round((end - start) / 60_000);
}

export function normalizeAppointment(row: Row): Appointment {
  const attendee = (row.attendee ?? {}) as Row;
  return {
    id: toText(row.id),
    title: toText(row.title) || "Appointment",
    startAt: textOrNull(row.start_at),
    durationMinutes: durationOf(row),
    status: toText(row.status),
    attendeeName: toText(attendee.name) || toText(row.attendee_name),
    attendeeEmail: toText(attendee.email) || toText(row.attendee_email),
    location: toText(row.location) || toText(row.meeting_url),
    fromBookingPage: toText(row.source) === "booking_page",
    createdAt: textOrNull(row.created_at),
  };
}

export function normalizeEmailCampaign(row: Row): EmailCampaign {
  return {
    id: toText(row.id),
    subject: toText(row.subject) || "(no subject)",
    status: toText(row.status),
    recipients: toMaybeNumber(row.recipients),
    openRate: toMaybeNumber(row.open_rate),
    clickRate: toMaybeNumber(row.click_rate),
    reason: toText(row.reason),
    createdAt: textOrNull(row.created_at),
  };
}

export function normalizeSmsCampaign(row: Row): SmsCampaign {
  return {
    id: toText(row.id),
    name: toText(row.name),
    message: toText(row.message),
    status: toText(row.status),
    type: toText(row.type),
    recipients: toMaybeNumber(row.recipients),
    sendAt: textOrNull(row.datetime) ?? textOrNull(row.created_at),
    createdAt: textOrNull(row.created_at),
  };
}
