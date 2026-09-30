"use client";

import { NotesView } from "@/components/notes/NotesView";
import { useWorkspace } from "./WorkspaceContext";

/**
 * The notes library: what the notetaker wrote up, and whatever the user writes
 * themselves. It sits beside Meetings because that is where most of it comes
 * from — a call ends, its write-up lands here and its action items become tasks.
 */
export function NotesTab() {
  const { agent } = useWorkspace();

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto grid w-full max-w-400 gap-5 px-4 pb-16 pt-8 sm:px-6 xl:px-10">
        <div className="mx-auto grid w-full max-w-4xl gap-5">
          <div className="grid gap-1.5">
            <h2 className="text-2xl font-semibold">Notes</h2>
            <p className="text-sm text-muted">
              Write-ups from calls {agent.name} sat in on, and anything you write yourself. Action items from a
              meeting become tasks, so they show up in For you.
            </p>
          </div>

          <NotesView />
        </div>
      </div>
    </div>
  );
}
