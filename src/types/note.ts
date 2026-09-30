/**
 * Notes — the library a meeting write-up lands in, and where the user writes
 * their own.
 *
 * The meetings service already writes into `dexi_notes` ("Writes a note into
 * `dexi_notes`, creates tasks for the user's own action items"), but **no route
 * exposes that table yet**: `/notes`, `/notes/{id}`, `/dexi-notes` and `/note`
 * all 404 (probed 2026-09-30). So this is modelled on the obvious REST shape and
 * confirmed against the first real payload — see `services/notes.ts`.
 */

/** Where a note came from. A meeting write-up is not editable the way a typed one is. */
export type NoteSource = "meeting" | "user" | "agent";

export type Note = {
  id: string;
  title: string;
  /** Markdown. Meeting write-ups arrive with headings and lists already. */
  body: string;
  source: NoteSource;
  /** Set when the note is a call's write-up, so the row can point back at it. */
  meetingId: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteInput = {
  title: string;
  body: string;
};
