/**
 * Notes — the library a meeting write-up lands in, and where the user writes
 * their own.
 *
 * **Confirmed live 2026-09-30.** Two shapes, and they differ in the one field
 * that matters: a list row carries `preview` (a snippet) and **no body at all**,
 * so opening a note needs `GET /notes/{id}`, which returns `content`.
 *
 * ```
 * list   {id, title, is_folder, pinned, source, preview, updated}
 * detail {id, parent_id, title, content, is_folder, pinned, source, kind, updated}
 * ```
 */

/** Where a note came from. `meeting` is a call's write-up rather than something typed. */
export type NoteSource = "meeting" | "user" | "agent";

export type Note = {
  id: string;
  title: string;
  /** Markdown, from `content` on the detail. Empty on a list row — use `preview` there. */
  body: string;
  /** The snippet the list shows, since list rows carry no body. */
  preview: string;
  source: NoteSource;
  /** Notes nest: a folder holds others, and `parentId` is what it sits in. */
  isFolder: boolean;
  parentId: string;
  pinned: boolean;
  /** `updated` on the wire. There is no `created_at`. */
  updatedAt: string;
};

export type NoteInput = {
  title: string;
  body: string;
};
