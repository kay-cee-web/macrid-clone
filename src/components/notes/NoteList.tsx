"use client";

import { Folder, Pin, Plus, Search, Video } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { timeAgo } from "@/lib/format";
import type { Note } from "@/types/note";

/**
 * The left pane: every note, newest edit first.
 *
 * Search filters in the browser — the same choice the Records views make,
 * because these endpoints ignore a `search` param and the whole list is already
 * read. A write-up from a call carries a small mark, since "did I write this or
 * did the agent" is the first thing you ask of a list like this.
 */
export function NoteList({
  notes,
  loading,
  selectedId,
  query,
  onQuery,
  onSelect,
  onNew,
}: {
  notes: Note[];
  loading: boolean;
  selectedId: string | null;
  query: string;
  onQuery: (value: string) => void;
  onSelect: (note: Note) => void;
  onNew: () => void;
}) {
  return (
    <div className="grid min-h-0 grid-rows-[auto_auto_1fr] gap-3 border-b border-line pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Notes</h3>
        <IconButton label="New note" onClick={onNew}>
          <Plus />
        </IconButton>
      </div>

      <Input
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Search notes"
        aria-label="Search notes"
        leading={<Search className="size-4 text-muted" />}
      />

      <div className="min-h-0 overflow-y-auto">
        {loading ? (
          <div className="grid gap-2">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : notes.length === 0 ? (
          <p className="px-1 py-2 text-xs text-muted">{query ? "Nothing matches that." : "No notes yet."}</p>
        ) : (
          <ul className="grid gap-1">
            {notes.map((note) => (
              <li key={note.id}>
                <button
                  type="button"
                  onClick={() => onSelect(note)}
                  aria-current={note.id === selectedId}
                  className={cn(
                    "grid w-full gap-0.5 rounded-xl px-3 py-2 text-left transition-colors",
                    note.id === selectedId ? "bg-raised" : "hover:bg-raised/60",
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {note.isFolder && <Folder aria-label="Folder" className="size-3.5 shrink-0 text-muted" />}
                    {!note.isFolder && note.source === "meeting" && (
                      <Video aria-label="From a call" className="size-3.5 shrink-0 text-muted" />
                    )}
                    <span className="truncate text-sm font-medium text-ink">{note.title}</span>
                    {note.pinned && <Pin aria-label="Pinned" className="size-3 shrink-0 text-muted" />}
                  </span>
                  <span className="truncate text-xs text-muted">
                    {note.preview || timeAgo(note.updatedAt) || "just now"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
