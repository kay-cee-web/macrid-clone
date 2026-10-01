import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList, pickOne, toText } from "@/lib/api/pick";
import { byRecentEdit, toNote } from "@/lib/notes/normalize";
import type { Note, NoteInput } from "@/types/note";

/**
 * The notes library over `dexi_notes`. **Live, confirmed 2026-09-30.**
 *
 * ```
 * GET    /notes       {status, notes: [{id, title, is_folder, pinned, source, preview, updated}]}
 * GET    /notes/{id}  {status, note:  {…, parent_id, content, kind}}
 * POST   /notes       {status, note: {id}}
 * PUT    /notes/{id}  {status, message: "Saved."}
 * DELETE /notes/{id}  {status, message: "Deleted."}
 * ```
 */
type Row = Record<string, unknown>;

const BASE = "/notes";

const messageOf = (data: unknown, fallback: string) => toText((data as Row)?.message) || fallback;

/** Every note, pinned first then newest edit. Search is done in the browser, like the Records views. */
export async function fetchNotes(): Promise<Note[]> {
  const { data } = await api.get(BASE);
  assertEnvelope(data, "Could not load your notes");
  return byRecentEdit(pickList<Row>(data, "notes").map(toNote));
}

/** The only call that returns a note's body — list rows carry `preview` alone. */
export async function fetchNote(id: string): Promise<Note> {
  const { data } = await api.get(`${BASE}/${id}`);
  assertEnvelope(data, "Could not load that note");
  return toNote(pickOne<Row>(data, "note"));
}

/**
 * Create, then save the body.
 *
 * **`POST /notes` stores the title and drops `content`** — a note created with
 * one comes back with `content: null` (confirmed 2026-09-30). `PUT` saves it
 * properly, so a note with a body is written in two calls rather than losing
 * what the user typed. Collapse this to one POST if the backend starts
 * honouring `content` on create.
 */
export async function createNote(input: NoteInput): Promise<Note> {
  const { data } = await api.post(BASE, { title: input.title, content: input.body });
  assertEnvelope(data, "Could not create that note");
  const created = toNote(pickOne<Row>(data, "note"));
  if (!input.body.trim()) return { ...created, updatedAt: created.updatedAt || new Date().toISOString() };
  return updateNote(created.id, input, created);
}

/**
 * PUT answers with a message, not the row, so the saved values are echoed back
 * rather than read again — this runs on every pause in typing, and a second GET
 * per keystroke-run would buy nothing the caller doesn't already hold.
 */
export async function updateNote(id: string, input: NoteInput, base?: Note): Promise<Note> {
  const { data } = await api.put(`${BASE}/${id}`, { title: input.title, content: input.body });
  assertEnvelope(data, "Could not save that note");
  return {
    id,
    title: input.title,
    body: input.body,
    preview: input.body.slice(0, 160),
    source: base?.source ?? "user",
    isFolder: base?.isFolder ?? false,
    parentId: base?.parentId ?? "",
    pinned: base?.pinned ?? false,
    updatedAt: new Date().toISOString(),
  };
}

export async function deleteNote(id: string): Promise<string> {
  const { data } = await api.delete(`${BASE}/${id}`);
  assertEnvelope(data, "Could not delete that note");
  return messageOf(data, "Note deleted.");
}
