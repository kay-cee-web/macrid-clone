"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAsync } from "@/hooks/useAsync";
import { extractApiError } from "@/lib/api/errors";
import { createNote, deleteNote, fetchNotes, updateNote } from "@/services/notes";
import type { Note, NoteInput } from "@/types/note";

/** A note that exists only on screen until it's saved. */
const blankNote = (): Note => ({
  id: "",
  title: "",
  body: "",
  source: "user",
  meetingId: "",
  createdAt: "",
  updatedAt: "",
});

/**
 * The notes library: what's in it, which one is open, and the three writes.
 *
 * Selection is deliberately not stored anywhere — a notes list is read
 * front-to-back, and the newest edit is nearly always the one you came for.
 */
export function useNotes() {
  const { data, status, error, reload } = useAsync(fetchNotes, [], "Could not load your notes");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Note | null>(null);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);

  const notes = useMemo(() => data ?? [], [data]);
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return notes;
    return notes.filter((note) => `${note.title} ${note.body}`.toLowerCase().includes(needle));
  }, [notes, query]);

  const selected = draft ?? notes.find((note) => note.id === selectedId) ?? shown[0] ?? null;

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
        const existingId = selected?.id;
        const saved = existingId ? await updateNote(existingId, input) : await createNote(input);
        toast.success(existingId ? "Note saved." : "Note created.");
        setDraft(null);
        setSelectedId(saved.id || null);
        reload();
      } catch (err) {
        toast.error(extractApiError(err, "Could not save that note"));
      } finally {
        setSaving(false);
      }
    },
    // `selected`, not `selected?.id`: the compiler infers the whole object and
    // refuses to keep a narrower manual dependency.
    [selected, reload],
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
        reload();
        return true;
      } catch (err) {
        toast.error(extractApiError(err, "Could not delete that note"));
        return false;
      }
    },
    [reload],
  );

  return { notes, shown, selected, draft, status, error, query, setQuery, saving, startNew, select, save, remove, reload };
}
