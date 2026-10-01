import { pickField, toBool, toText } from "@/lib/api/pick";
import { inlineToText } from "./inline";
import type { Note, NoteSource } from "@/types/note";

/**
 * Reader for the notes routes, **confirmed against live rows 2026-09-30**.
 *
 * The body is `content` and only the detail route sends it; a list row has
 * `preview` instead. The timestamp is `updated`, and there is no `created_at`.
 * One reader covers both shapes, so a note keeps whatever it was given.
 */
type Row = Record<string, unknown>;

function toSource(value: unknown): NoteSource {
  const source = toText(value).toLowerCase();
  if (source === "meeting" || source === "call") return "meeting";
  if (source === "agent" || source === "assistant") return "agent";
  return "user";
}

/** The first line of the body, for a note saved without a title. */
function titleFrom(text: string): string {
  const first = text.split("\n").map((line) => line.trim()).find(Boolean);
  if (!first) return "Untitled note";
  return first.length > 60 ? `${first.slice(0, 60)}…` : first;
}

export function toNote(row: Row): Note {
  const body = toText(pickField(row, ["content", "body", "text"]));
  // The wire carries raw markdown. A row and a derived title are read, not
  // written in, so the marks come off before either is shown.
  const preview = inlineToText(toText(pickField(row, ["preview", "excerpt", "snippet"])));
  return {
    id: toText(row.id),
    title: toText(pickField(row, ["title", "name"])) || titleFrom(inlineToText(body) || preview),
    body,
    preview,
    source: toSource(pickField(row, ["source", "origin"])),
    isFolder: toBool(pickField(row, ["is_folder", "isFolder"]), false),
    parentId: toText(pickField(row, ["parent_id", "parentId"])),
    pinned: toBool(pickField(row, ["pinned", "is_pinned"]), false),
    updatedAt: toText(pickField(row, ["updated", "updated_at", "updatedAt"])),
  };
}

/**
 * Pinned first, then newest edit — the order a notes list is useful in, and the
 * only thing `pinned` is used for until there's a route to toggle it.
 */
export function byRecentEdit(notes: Note[]): Note[] {
  const at = (note: Note) => new Date(note.updatedAt).getTime() || 0;
  return [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned) || at(b) - at(a));
}
