"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Markdown } from "@/components/ui/Markdown";
import { Pill } from "@/components/ui/Pill";
import { formatDateTime } from "@/lib/format";
import type { Note, NoteInput } from "@/types/note";

/**
 * The right pane: read a note, or edit it.
 *
 * Read mode renders markdown, because a meeting write-up arrives with headings
 * and lists already and is the common case. Editing is a plain textarea rather
 * than a block editor — the body is markdown either way, and a half-built
 * editor would be worse than a text box that round-trips exactly what it is
 * given.
 *
 * The draft lives in state seeded from the note, so the caller mounts this with
 * `key={note.id}`: switching notes remounts it rather than syncing props into
 * state in an effect, which this project's lint forbids and which would drop a
 * half-typed edit on any unrelated re-render.
 */
export function NoteEditor({
  note,
  saving,
  onSave,
  onDelete,
}: {
  note: Note;
  saving: boolean;
  onSave: (input: NoteInput) => void;
  onDelete: (note: Note) => void;
}) {
  const [editing, setEditing] = useState(!note.body && !note.title);
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);

  return (
    <div className="grid min-h-0 content-start gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled note"
              aria-label="Note title"
              className="w-full border-0 bg-transparent p-0 text-2xl font-semibold tracking-tight text-ink outline-none placeholder:text-faint"
            />
          ) : (
            <h3 className="truncate text-2xl font-semibold tracking-tight">{note.title}</h3>
          )}
          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            {note.source === "meeting" && <Pill>From a call</Pill>}
            {note.updatedAt && <span>Edited {formatDateTime(note.updatedAt)}</span>}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {editing ? (
            <Button size="sm" loading={saving} onClick={() => onSave({ title, body })}>
              Save
            </Button>
          ) : (
            <Button variant="secondary" size="sm" icon={<Pencil className="size-3.5" />} onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 className="size-3.5" />}
            onClick={() => onDelete(note)}
            aria-label="Delete note"
          >
            Delete
          </Button>
        </div>
      </div>

      {editing ? (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write anything. Markdown works."
          aria-label="Note body"
          rows={16}
          className="w-full resize-y rounded-xl border border-line bg-surface p-3 font-sans text-sm leading-relaxed text-ink outline-none focus:border-accent focus:ring-3 focus:ring-accent-soft"
        />
      ) : note.body ? (
        <Markdown>{note.body}</Markdown>
      ) : (
        <p className="text-sm text-muted">This note is empty. Press Edit to write in it.</p>
      )}
    </div>
  );
}
