import { pickField, toText } from "@/lib/api/pick";
import type { Note, NoteSource } from "@/types/note";

/**
 * Reader for the notes routes.
 *
 * **Nothing here is confirmed** — the routes 404 as of 2026-09-30 — so every
 * field is read through a list of plausible names and anything missing degrades
 * to empty. When the first real note arrives, delete the spellings that turn
 * out to be wrong rather than leaving all of them.
 */
type Row = Record<string, unknown>;

function toSource(value: unknown, meetingId: string): NoteSource {
  const source = toText(value).toLowerCase();
  if (source === "meeting" || source === "call") return "meeting";
  if (source === "agent" || source === "assistant") return "agent";
  if (source === "user" || source === "manual") return "user";
  // A note carrying a meeting id came from a call, whatever it calls itself.
  return meetingId ? "meeting" : "user";
}

/** The first line of the body, for a note saved without a title. */
function titleFrom(body: string): string {
  const first = body.split("\n").map((line) => line.replace(/^#+\s*/, "").trim()).find(Boolean);
  if (!first) return "Untitled note";
  return first.length > 60 ? `${first.slice(0, 60)}…` : first;
}

export function toNote(row: Row): Note {
  const body = toText(pickField(row, ["body", "content", "text", "note", "summary"]));
  const meetingId = toText(pickField(row, ["meeting_id", "meetingId", "dexi_meeting_id"]));
  return {
    id: toText(row.id),
    title: toText(pickField(row, ["title", "name", "subject"])) || titleFrom(body),
    body,
    source: toSource(pickField(row, ["source", "type", "origin"]), meetingId),
    meetingId,
    createdAt: toText(pickField(row, ["created_at", "createdAt"])),
    updatedAt: toText(pickField(row, ["updated_at", "updatedAt"])) || toText(pickField(row, ["created_at"])),
  };
}

/** Newest edit first, which is the order a notes list is useful in. */
export function byRecentEdit(notes: Note[]): Note[] {
  const at = (note: Note) => new Date(note.updatedAt || note.createdAt).getTime() || 0;
  return [...notes].sort((a, b) => at(b) - at(a));
}
