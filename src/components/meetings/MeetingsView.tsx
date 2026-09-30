"use client";

import { useState } from "react";
import { Video } from "lucide-react";
import { toast } from "sonner";
import { WorkspaceConnectorFlows } from "@/components/plugins/ConnectorFlows";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useMeetings } from "@/hooks/useMeetings";
import { extractApiError } from "@/lib/api/errors";
import { cancelMeeting, coverUpcoming } from "@/services/meetings";
import type { Meeting } from "@/types/meeting";
import { CalendarConnectors } from "./CalendarConnectors";
import { MeetingActions } from "./MeetingActions";
import { MeetingRow } from "./MeetingRow";
import { SendNotetakerModal } from "./SendNotetakerModal";

/** Meetings the notetaker has been sent to, and the two ways to send it. */
export function MeetingsView({ agentName, notesHref }: { agentName: string; notesHref: string }) {
  // Polls itself while a call is live, so a row never sits on "Scheduled" after the bot has joined.
  const { data, status, error, refreshing, reload } = useMeetings();
  const [sending, setSending] = useState(false);
  const [covering, setCovering] = useState(false);
  const [toCancel, setToCancel] = useState<Meeting | null>(null);

  const meetings = data?.meetings ?? [];
  const allowance = data?.allowance;

  const cancel = async () => {
    if (!toCancel) return false;
    try {
      toast.success(await cancelMeeting(toCancel.id));
      reload();
      return true;
    } catch (err) {
      toast.error(extractApiError(err, "Could not cancel that notetaker"));
      return false;
    }
  };

  const cover = async () => {
    try {
      toast.success(await coverUpcoming());
      reload();
      return true;
    } catch (err) {
      toast.error(extractApiError(err, "Could not cover your upcoming meetings"));
      return false;
    }
  };

  return (
    <div className="grid gap-5">
      <WorkspaceConnectorFlows>
        <CalendarConnectors />
      </WorkspaceConnectorFlows>

      <MeetingActions
        allowance={allowance}
        refreshing={refreshing}
        onSend={() => setSending(true)}
        onCover={() => setCovering(true)}
        onRefresh={reload}
      />

      {status === "error" && (
        <div className="grid gap-3">
          <Alert>{error}</Alert>
          <div>
            <Button variant="secondary" size="sm" onClick={reload}>
              Try again
            </Button>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="grid gap-2">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      )}

      {status === "ready" && meetings.length === 0 && (
        <EmptyState
          icon={<Video />}
          title="No meetings yet"
          description={`Send ${agentName} to a call and the notes, decisions and your action items land here — and in your briefing.`}
        />
      )}

      {meetings.length > 0 && (
        <div className="border-t border-line">
          {meetings.map((meeting) => (
            <MeetingRow
              key={meeting.id}
              meeting={meeting}
              notesHref={notesHref}
              onCancel={setToCancel}
              cancelling={false}
            />
          ))}
        </div>
      )}

      {sending && <SendNotetakerModal open onClose={() => setSending(false)} onSent={reload} />}

      {toCancel && (
        <ConfirmModal
          title="Call off the notetaker?"
          description={`It won't join "${toCancel.title}". Nothing recorded, nothing charged.`}
          confirmLabel="Call it off"
          onConfirm={cancel}
          onClose={() => setToCancel(null)}
        />
      )}

      {covering && (
        <ConfirmModal
          title="Cover your upcoming meetings?"
          description="The notetaker joins everything already on your calendar, and everyone on those calls will see it. Recording time is billed once the free monthly minutes run out."
          confirmLabel="Book them"
          tone="primary"
          onConfirm={cover}
          onClose={() => setCovering(false)}
        />
      )}
    </div>
  );
}
