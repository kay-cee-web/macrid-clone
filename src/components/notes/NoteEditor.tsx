"use client";

import { useState } from "react";
import { Copy, Eye, MoreHorizontal, PenLine, Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Markdown } from "@/components/ui/Markdown";
import { Menu } from "@/components/ui/Menu";
import { Pill } from "@/components/ui/Pill";
import { useAutosave, type SaveStatus } from "@/hooks/useAutosave";
import { useClipboard } from "@/hooks/useClipboard";
import { formatDateTime } from "@/lib/format";
import type { Note, NoteInput } from "@/types/note";
import { BlockEditor } from "./BlockEditor";

/** Only the states worth a word. "saved" and "idle" leave the edited time showing. */
const SAVING: Partial<Record<SaveStatus, string>> = { pending: "Saving…", saving: "Saving…", error: "Not saved" };

/**
 * The open note: a title, the blocks, and a save nobody has to think about.
 *
 * There is no Save button. Every change is scheduled through `useAutosave`,
 * which also writes on unmount — so closing the note, picking another one or
 * leaving the page all keep what was typed.
 *
 * The draft lives in state seeded from the note, so the caller mounts this with
 * a stable `key` per open note: switching notes remounts it rather than syncing
 * props into state in an effect, which this project's lint forbids and which
 * would drop a half-typed edit on any unrelated re-render.
 */
export function NoteEditor({
  note,
  onSave,
  onDelete,
  onNewNote,
}: {
  note: Note;
  onSave: (input: NoteInput) => Promise<unknown>;
  onDelete: (note: Note) => void;
  onNewNote: () => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [reading, setReading] = useState(false);
  const autosave = useAutosave<NoteInput>(onSave);
  const clipboard = useClipboard();

  const edit = (next: Partial<NoteInput>) => {
    const input = { title, body, ...next };
    if (next.title !== undefined) setTitle(next.title);
    if (next.body !== undefined) setBody(next.body);
    // A new note isn't created until there is something in it. Adding a block to
    // an empty draft is not writing a note, and `POST /notes` with no title
    // throws on the server rather than answering an error.
    if (!note.id && !input.title.trim() && !input.body.trim()) return;
    autosave.schedule(input);
  };

  // `pl-14` is the margin the block handles live in, so the title and the blocks
  // under it start on the same line.
  return (
    <div className="grid min-h-0 content-start gap-2 pl-14">
      <div className="flex items-start gap-3">
        {/* A reading column, so a line of prose doesn't run the width of the screen. */}
        <div className="min-w-0 max-w-3xl flex-1">
          <input
            value={title}
            onChange={(event) => edit({ title: event.target.value })}
            placeholder="Untitled note"
            aria-label="Note title"
            className="w-full border-0 bg-transparent p-0 font-display text-3xl font-semibold tracking-tight text-ink outline-none placeholder:text-faint"
          />
          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted">
            {note.source === "meeting" && <Pill>From a call</Pill>}
            <span className={autosave.status === "error" ? "text-bad" : undefined}>
              {SAVING[autosave.status] ??
                (note.updatedAt ? `Edited ${formatDateTime(note.updatedAt)}` : "Not saved yet")}
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 pt-1">
          <IconButton
            label={reading ? "Write" : "Read"}
            aria-pressed={reading}
            onClick={() => setReading((on) => !on)}
          >
            {reading ? <PenLine /> : <Eye />}
          </IconButton>
          <Menu
            items={[
              { label: "Copy as markdown", icon: <Copy />, onSelect: () => void clipboard.copy(body, "Copied.") },
              { label: "Delete note", icon: <Trash2 />, tone: "danger", onSelect: () => onDelete(note) },
            ]}
            trigger={(props) => (
              <IconButton label="Note options" {...props}>
                <MoreHorizontal />
              </IconButton>
            )}
          />
        </div>
      </div>

      <div className="max-w-3xl">
        {note.isFolder ? (
          // Nothing creates folders here yet; showing one honestly beats hiding it.
          <p className="text-sm text-muted">This is a folder. Open a note inside it to read or edit.</p>
        ) : reading ? (
          // The same markdown, rendered: bold, links and tables as they'll be read.
          <div className="min-h-24 pt-2">
            {body.trim() ? <Markdown>{body}</Markdown> : <p className="text-sm text-muted">This note is empty.</p>}
          </div>
        ) : (
          <BlockEditor initial={note.body} onChange={(markdown) => edit({ body: markdown })} onNewNote={onNewNote} />
        )}
      </div>
    </div>
  );
}
