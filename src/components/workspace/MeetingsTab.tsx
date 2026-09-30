"use client";

import { MeetingsView } from "@/components/meetings/MeetingsView";
import { useWorkspace } from "./WorkspaceContext";

/**
 * Meeting notes for this agent: send the notetaker, read what it wrote.
 *
 * The output doesn't stop here — the write-up is saved as a note and the
 * user's own action items become tasks, both of which surface in "For you".
 * This tab is where the bot is sent and the transcript is read back.
 */
export function MeetingsTab() {
  const { agent } = useWorkspace();

  return (
    <div className="h-full overflow-y-auto">
      {/* The outer container matches every other tab, so switching doesn't move the page.
          The reading column is centred inside it — left-aligned in a 1600px shell leaves
          half the screen empty. */}
      <div className="mx-auto grid w-full max-w-400 gap-5 px-4 pb-16 pt-8 sm:px-6 xl:px-10">
        <div className="mx-auto grid w-full max-w-3xl gap-5">
          <div className="grid gap-1.5">
            <h2 className="text-2xl font-semibold">Meetings</h2>
            <p className="text-sm text-muted">
              {agent.name} joins your calls as a notetaker, records them and writes up what was decided. Your own
              action items become tasks, so they show up in For you.
            </p>
          </div>

          <MeetingsView agentName={agent.name} notesHref={`/agents/${agent.id}/notes`} />
        </div>
      </div>
    </div>
  );
}
