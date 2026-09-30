"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { buttonStyles } from "@/components/ui/button-styles";
import { canCancel, costLabel, hasNotes, statusOf, whenLabel } from "@/lib/meetings/display";
import type { Meeting } from "@/types/meeting";

/**
 * One meeting: what it is, when, and the one thing you can do about it now.
 *
 * The write-up is **not** shown here. A call's notes are a note — the backend
 * writes them into `dexi_notes` — so this links to the Notes tab rather than
 * duplicating a second, thinner copy on the row. That also keeps the row a
 * schedule entry, which is what a list of calls should read as.
 */
export function MeetingRow({
  meeting,
  notesHref,
  onCancel,
  cancelling,
}: {
  meeting: Meeting;
  notesHref: string;
  onCancel: (meeting: Meeting) => void;
  cancelling: boolean;
}) {
  const status = statusOf(meeting);
  const detail = [whenLabel(meeting), meeting.service, meeting.people ? `${meeting.people} people` : "", costLabel(meeting)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex flex-wrap items-start gap-3 border-b border-line py-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{meeting.title}</p>
        {detail && <p className="text-xs text-muted">{detail}</p>}

        {/* The backend's own reason, where the user will look before pressing anything. */}
        {meeting.problem && (
          <p className="mt-1.5 rounded-lg bg-warn-soft px-2.5 py-1.5 text-xs leading-relaxed text-warn">
            {meeting.problem}
          </p>
        )}

        {meeting.actionCount > 0 && (
          <p className="mt-1 text-xs text-muted">
            {meeting.actionCount} action {meeting.actionCount === 1 ? "item" : "items"} added to your tasks
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Pill tone={status.tone} dot={meeting.status === "recording"}>
          {status.label}
        </Pill>
        {canCancel(meeting) && (
          <Button variant="ghost" size="sm" onClick={() => onCancel(meeting)} loading={cancelling}>
            Cancel
          </Button>
        )}
        {hasNotes(meeting) && (
          <Link href={notesHref} className={buttonStyles({ variant: "secondary", size: "sm" })}>
            Notes
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
