import type { Note, NoteInput } from "@/types/note";

/**
 * A local stand-in for the notes API, so the library can be used and reviewed
 * before `dexi_notes` has a route (`/notes` 404s, probed 2026-09-30).
 *
 * It never touches the network, so nothing here can be mistaken for a working
 * backend: the screen says so in a banner, and everything lives in this tab
 * only. Delete this file and the `PREVIEW` block in `services/notes.ts` the day
 * the routes ship.
 */
/** Bumped when the shape or contents change, so an old tab's copy is ignored. */
const KEY = "dexisphere.notes.preview.v2";

/**
 * Starts empty. No sample notes: a list seeded with invented rows reads as real
 * data, and the point of this screen right now is to try writing one.
 */
function read(): Note[] {
  try {
    const saved = sessionStorage.getItem(KEY);
    if (saved) return JSON.parse(saved) as Note[];
  } catch {
    /* private window, blocked storage, or a bad value — start empty */
  }
  return [];
}

function write(notes: Note[]): Note[] {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(notes));
  } catch {
    /* nothing to do: the list still works for this render */
  }
  return notes;
}

const nextId = (notes: Note[]) => String(Math.max(0, ...notes.map((n) => Number(n.id) || 0)) + 1);

export async function previewList(): Promise<Note[]> {
  return read();
}

export async function previewCreate(input: NoteInput): Promise<Note> {
  const notes = read();
  const now = new Date().toISOString();
  const note: Note = {
    id: nextId(notes),
    title: input.title,
    body: input.body,
    source: "user",
    meetingId: "",
    createdAt: now,
    updatedAt: now,
  };
  write([note, ...notes]);
  return note;
}

export async function previewUpdate(id: string, input: NoteInput): Promise<Note> {
  const notes = read();
  const found = notes.find((note) => note.id === id);
  if (!found) throw new Error("That note is no longer here.");
  const updated: Note = { ...found, ...input, updatedAt: new Date().toISOString() };
  write(notes.map((note) => (note.id === id ? updated : note)));
  return updated;
}

export async function previewDelete(id: string): Promise<string> {
  write(read().filter((note) => note.id !== id));
  return "Note deleted.";
}
