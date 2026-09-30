"use client";

import { useState } from "react";
import { NotebookPen } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useNotes } from "@/hooks/useNotes";
import type { Note } from "@/types/note";
import { NoteEditor } from "./NoteEditor";
import { NoteList } from "./NoteList";

export function NotesView() {
  const notes = useNotes();
  const [toDelete, setToDelete] = useState<Note | null>(null);

  if (notes.status === "error") {
    return (
      <div className="grid gap-3">
        <Alert>{notes.error}</Alert>
        <div>
          <Button variant="secondary" size="sm" onClick={notes.reload}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (notes.status === "ready" && notes.notes.length === 0 && !notes.draft) {
    return (
      <EmptyState
        icon={<NotebookPen />}
        title="Create your first note"
        description="Write your own, or send the notetaker to a call and its write-up lands here."
        action={<Button onClick={notes.startNew}>Add new note</Button>}
      />
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
        <NoteList
          notes={notes.shown}
          loading={notes.status === "loading"}
          selectedId={notes.draft ? "" : (notes.selected?.id ?? null)}
          query={notes.query}
          onQuery={notes.setQuery}
          onSelect={notes.select}
          onNew={notes.startNew}
        />

        {notes.selected ? (
          // Remount per note, so the editor's draft is seeded fresh instead of
          // syncing props into state in an effect.
          <NoteEditor
            key={notes.selected.id || "draft"}
            note={notes.selected}
            saving={notes.saving}
            onSave={notes.save}
            onDelete={setToDelete}
          />
        ) : (
          <p className="self-start text-sm text-muted">Pick a note, or start a new one.</p>
        )}
      </div>

      {toDelete && (
        <ConfirmModal
          title="Delete this note?"
          description={`"${toDelete.title || "Untitled note"}" will be removed. This can't be undone.`}
          confirmLabel="Delete"
          onConfirm={() => notes.remove(toDelete)}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
