import type { Metadata } from "next";
import { MeetingsView } from "@/components/meetings/MeetingsView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Meetings",
  description: "Send a notetaker to a call to record, transcribe and write up what was decided.",
  path: "/meetings",
});

/**
 * A workspace section, not an agent's tab: `/meetings` carries no agent id, and
 * a recorded call belongs to the account rather than to whichever agent was
 * open when the bot was sent.
 */
export default function MeetingsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto grid w-full max-w-400 gap-5 px-4 pb-16 pt-8 sm:px-6 xl:px-10">
        <div className="mx-auto grid w-full max-w-3xl gap-5">
          <div className="grid gap-1.5">
            <h1 className="text-2xl font-semibold">Meetings</h1>
            <p className="text-sm text-muted">
              Send a notetaker to a call and it records, transcribes and writes up what was decided. The write-up
              lands in Notes, and your own action items become tasks.
            </p>
          </div>

          <MeetingsView notesHref="/notes" />
        </div>
      </div>
    </div>
  );
}
