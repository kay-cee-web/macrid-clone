import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList, pickOne, toText } from "@/lib/api/pick";
import { byRecentEdit, toNote } from "@/lib/notes/normalize";
import { previewCreate, previewDelete, previewList, previewUpdate } from "@/lib/notes/preview";
import type { Note, NoteInput } from "@/types/note";

/**
 * The notes library over `dexi_notes`.
 *
 * **NOT LIVE.** `GET /notes`, `GET /notes/{id}`, `POST /notes`, `/dexi-notes`
 * and `/note` all answered 404 on 2026-09-30, against a control that 404s the
 * same way — so the table the meetings service writes into has no reader yet.
 * The paths and bodies below are the obvious REST shape and are **unconfirmed**.
 *
 * This file is the single place to change when the routes land: the components
 * only ever see `Note`, so a different envelope key or field name is a fix here
 * and in `lib/notes/normalize.ts`, nowhere else.
 */
type Row = Record<string, unknown>;

const BASE = "/notes";

/**
 * **The one switch.** While `/notes` does not exist, the library runs on a
 * local store (`lib/notes/preview.ts`) and makes no request at all — calling a
 * route that 404s would only put an error on a screen that otherwise works.
 * The screen says it is a preview, so nothing is mistaken for saved data.
 *
 * When the routes land: set this to `false`, check the real payload against
 * `lib/notes/normalize.ts`, then delete the flag, the preview import and
 * `preview.ts`.
 */
export const NOTES_PREVIEW = true;

const messageOf = (data: unknown, fallback: string) => toText((data as Row)?.message) || fallback;

/** Every note, newest edit first. Search is done in the browser, like the Records views. */
export async function fetchNotes(): Promise<Note[]> {
  if (NOTES_PREVIEW) return byRecentEdit(await previewList());
  const { data } = await api.get(BASE);
  assertEnvelope(data, "Could not load your notes");
  return byRecentEdit(pickList<Row>(data, "notes").map(toNote));
}

export async function fetchNote(id: string): Promise<Note> {
  const { data } = await api.get(`${BASE}/${id}`);
  assertEnvelope(data, "Could not load that note");
  return toNote(pickOne<Row>(data, "note"));
}

export async function createNote(input: NoteInput): Promise<Note> {
  if (NOTES_PREVIEW) return previewCreate(input);
  const { data } = await api.post(BASE, { title: input.title, body: input.body });
  assertEnvelope(data, "Could not create that note");
  return toNote(pickOne<Row>(data, "note"));
}

export async function updateNote(id: string, input: NoteInput): Promise<Note> {
  if (NOTES_PREVIEW) return previewUpdate(id, input);
  const { data } = await api.put(`${BASE}/${id}`, { title: input.title, body: input.body });
  assertEnvelope(data, "Could not save that note");
  return toNote(pickOne<Row>(data, "note"));
}

export async function deleteNote(id: string): Promise<string> {
  if (NOTES_PREVIEW) return previewDelete(id);
  const { data } = await api.delete(`${BASE}/${id}`);
  assertEnvelope(data, "Could not delete that note");
  return messageOf(data, "Note deleted.");
}
