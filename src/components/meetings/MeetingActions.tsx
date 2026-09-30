"use client";

import { CalendarCheck, RefreshCw, Video } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { MeetingAllowance } from "@/types/meeting";

/**
 * The two ways to send the notetaker, with what it will cost beside them.
 *
 * Both open a confirm rather than acting: this is the click that puts a named
 * bot in front of whoever is on the call, and spends recorded minutes.
 */
export function MeetingActions({
  allowance,
  refreshing,
  onSend,
  onCover,
  onRefresh,
}: {
  allowance: MeetingAllowance | undefined;
  refreshing: boolean;
  onSend: () => void;
  onCover: () => void;
  onRefresh: () => void;
}) {
  const left = allowance?.freeMinutesLeft;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button icon={<Video className="size-4" />} onClick={onSend}>
        Send the notetaker
      </Button>
      {/* Never automatic: a bot turning up uninvited is the worst thing this can do. */}
      <Button variant="secondary" icon={<CalendarCheck className="size-4" />} onClick={onCover}>
        Cover my upcoming meetings
      </Button>

      {/* The one number that says whether the next call is free. Shown only when sent. */}
      {typeof left === "number" && (
        <span className="text-xs text-muted">
          {allowance?.freeMinutesTotal
            ? `${left} of ${allowance.freeMinutesTotal} free minutes left this month`
            : `${left} free minutes left this month`}
        </span>
      )}

      {/* Polling covers a live call; this is for a bot booked further out, which is left alone. */}
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto"
        onClick={onRefresh}
        disabled={refreshing}
        icon={<RefreshCw className={refreshing ? "size-3.5 animate-spin" : "size-3.5"} />}
      >
        Refresh
      </Button>
    </div>
  );
}
