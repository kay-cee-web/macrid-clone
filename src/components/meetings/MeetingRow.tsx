"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";
import { canCancel, costLabel, hasNotes, statusOf, whenLabel } from "@/lib/meetings/display";
import type { Meeting } from "@/types/meeting";

/**
 * One meeting: what it is, when, who was on it, and the one thing you can do
 * about it now. Rows rather than cards — this is a schedule, and the notes
 * underneath are the only thing worth opening.
 */
export function MeetingRow({
  meeting,
  tokensPerHour,
  onCancel,
  cancelling,
}: {
  meeting: Meeting;
  tokensPerHour: number | null;
  onCancel: (meeting: Meeting) => void;
  cancelling: boolean;
}) {
  const [open, setOpen] = useState(false);
  const status = statusOf(meeting);
  const cost = costLabel(meeting, tokensPerHour);
  const people = meeting.attendees.length;

  return (
    <div className="border-b border-line py-3.5">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink">{meeting.title}</p>
          <p className="text-xs text-muted">
            {[whenLabel(meeting), people ? `${people} ${people === 1 ? "person" : "people"}` : "", cost]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {meeting.problem && <p className="mt-1 text-xs text-warn">{meeting.problem}</p>}
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
            <Button
              variant="secondary"
              size="sm"
              aria-expanded={open}
              onClick={() => setOpen((was) => !was)}
              iconRight={<ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />}
            >
              Notes
            </Button>
          )}
        </div>
      </div>

      {open && hasNotes(meeting) && (
        <div className="mt-3 grid gap-3 rounded-xl border border-line bg-raised/40 p-4">
          {meeting.summary && <p className="whitespace-pre-line text-sm leading-relaxed text-ink">{meeting.summary}</p>}

          {meeting.actionItems.length > 0 && (
            <div className="grid gap-1.5">
              {/* The backend only attributes the user's own items, and turns them into tasks. */}
              <p className="text-xs font-medium text-muted">Your action items — already added to Tasks</p>
              <ul className="grid gap-1">
                {meeting.actionItems.map((item, index) => (
                  <li key={`${index}:${item.slice(0, 24)}`} className="text-sm text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {meeting.recordingUrl && (
            <a
              href={meeting.recordingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-1.5 text-sm text-accent hover:underline"
            >
              Open the recording
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
