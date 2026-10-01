"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAsync } from "@/hooks/useAsync";
import { extractApiError } from "@/lib/api/errors";
import { createNote, deleteNote, fetchNote, fetchNotes, updateNote } from "@/services/notes";
import type { Note, NoteInput } from "@/types/note";

/** A note that exists only on screen until it's saved. */
const blankNote = (): Note => ({
  id: "",
  title: "",
  body: "",
  preview: "",
  source: "user",
  isFolder: false,
  parentId: "",
  pinned: false,
  updatedAt: "",
});

/**
 * The notes library: what's in it, which one is open, and the three writes.
 *
 * Two reads, not one, because a list row carries no body — only `preview`. The
 * editor waits for the second one (`opening`) rather than mounting on a bodyless
 * row, which would seed it empty and then autosave that over the real note.
 */
export function useNotes() {
  const list = useAsync(fetchNotes, [], "Could not load your notes");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Note | null>(null);
  // The editor's `key`. It moves only when a different note is opened — never
  // when a draft is saved — so a note isn't remounted, and the caret lost, the
  // moment the first autosave gives it an id.
  const [openKey, setOpenKey] = useState("first");
  const [query, setQuery] = useState("");

  const notes = useMemo(() => list.data ?? [], [list.data]);
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return notes;
    return notes.filter((note) => `${note.title} ${note.preview}`.toLowerCase().includes(needle));
  }, [notes, query]);

  const row = notes.find((note) => note.id === selectedId) ?? shown[0] ?? null;
  // A folder has nothing to open, and an unsaved draft is already whole.
  const openId = draft || !row || row.isFolder ? "" : row.id;
  const open = useAsync(
    () => (openId ? fetchNote(openId) : Promise.resolve(null)),
    [openId],
    "Could not load that note",
  );

  const loaded = open.data && open.data.id === row?.id ? open.data : null;
  const selected = draft ?? loaded ?? row;

  const startNew = useCallback(() => {
    setDraft(blankNote());
    setSelectedId(null);
    setOpenKey(`new-${Date.now()}`);
  }, []);

  const select = useCallback((note: Note) => {
    setDraft(null);
    setSelectedId(note.id);
    setOpenKey(note.id);
  }, []);

  const save = useCallback(
    async (input: NoteInput) => {
      const existing = selected?.id;
      try {
        // The open note is the base, so echoing the save back can't blank the
        // fields a PUT doesn't return — its source, its folder, its pin.
        const saved = existing ? await updateNote(existing, input, selected ?? undefined) : await createNote(input);
        // Hold the saved note as the open one: it carries the id and the body
        // just written, so a freshly created note needs no second read.
        setDraft(saved);
        setSelectedId(saved.id);
        list.reload();
      } catch (err) {
        toast.error(extractApiError(err, "Could not save that note"));
        // Rethrown so the editor can say it isn't saved rather than look saved.
        throw err;
      }
    },
    [selected, list],
  );

  const remove = useCallback(
    async (note: Note) => {
      // An unsaved draft has nothing on the server to delete.
      if (!note.id) {
        setDraft(null);
        setOpenKey(`closed-${Date.now()}`);
        return true;
      }
      try {
        toast.success(await deleteNote(note.id));
        setDraft(null);
        setSelectedId(null);
        setOpenKey(`closed-${Date.now()}`);
        list.reload();
        return true;
      } catch (err) {
        toast.error(extractApiError(err, "Could not delete that note"));
        return false;
      }
    },
    [list],
  );

  return {
    notes,
    shown,
    selected,
    draft,
    status: list.status,
    error: list.error,
    /** True while the open note's body is still coming; the editor waits for it. */
    opening: Boolean(openId) && open.status === "loading",
    /** Stable per open note — the editor's `key`. */
    openKey,
    query,
    setQuery,
    startNew,
    select,
    save,
    remove,
    reload: list.reload,
  };
}
