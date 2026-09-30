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
 * row shows immediately and the full note arrives behind it, so opening one
 * never blanks the pane it replaces.
 */
export function useNotes() {
  const list = useAsync(fetchNotes, [], "Could not load your notes");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Note | null>(null);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);

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
  }, []);

  const select = useCallback((note: Note) => {
    setDraft(null);
    setSelectedId(note.id);
  }, []);

  const save = useCallback(
    async (input: NoteInput) => {
      setSaving(true);
      try {
        const existing = selected?.id;
        const saved = existing ? await updateNote(existing, input) : await createNote(input);
        toast.success(existing ? "Note saved." : "Note created.");
        setDraft(null);
        setSelectedId(saved.id || null);
        list.reload();
      } catch (err) {
        toast.error(extractApiError(err, "Could not save that note"));
      } finally {
        setSaving(false);
      }
    },
    [selected, list],
  );

  const remove = useCallback(
    async (note: Note) => {
      // An unsaved draft has nothing on the server to delete.
      if (!note.id) {
        setDraft(null);
        return true;
      }
      try {
        toast.success(await deleteNote(note.id));
        setSelectedId(null);
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
    /** True while the open note's body is still coming. */
    opening: Boolean(openId) && open.status === "loading",
    query,
    setQuery,
    saving,
    startNew,
    select,
    save,
    remove,
    reload: list.reload,
  };
}
