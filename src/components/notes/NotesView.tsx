"use client";

import { useState } from "react";
import { NotebookPen } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
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
      <div className="grid gap-4 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
        <NoteList
          notes={notes.shown}
          loading={notes.status === "loading"}
          selectedId={notes.selected?.id ?? null}
          query={notes.query}
          onQuery={notes.setQuery}
          onSelect={notes.select}
          onNew={notes.startNew}
        />

        {notes.opening ? (
          // The body arrives in a second read, and the editor must not mount on
          // a bodyless list row — it would seed empty and autosave that back.
          <div className="grid gap-3 pt-1">
            <Skeleton className="h-9 w-2/3 rounded-xl" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-5/6 rounded-lg" />
          </div>
        ) : notes.selected ? (
          <NoteEditor
            key={notes.openKey}
            note={notes.selected}
            onSave={notes.save}
            onDelete={setToDelete}
            onNewNote={notes.startNew}
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
