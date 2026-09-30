"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import { extractApiError } from "@/lib/api/errors";
import { sendNotetaker } from "@/services/meetings";

/**
 * Point the notetaker at a call.
 *
 * Two things are said here rather than buried, because this is the click that
 * spends money and records people: what it costs, and that the bot is visible
 * to everyone on the call. Neither is a setting — there is no silent mode, and
 * the copy should never imply one could be arranged.
 */
export function SendNotetakerModal({
  open,
  onClose,
  onSent,
}: {
  open: boolean;
  onClose: () => void;
  onSent: () => void;
}) {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");

  const close = () => {
    setMeetingUrl("");
    setTitle("");
    setStartsAt("");
    setFailure("");
    onClose();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!meetingUrl.trim() || busy) return;
    setBusy(true);
    setFailure("");
    try {
      const message = await sendNotetaker({
        meetingUrl: meetingUrl.trim(),
        title: title.trim() || undefined,
        // datetime-local has no zone; the backend reads it in the account's.
        startsAt: startsAt || undefined,
      });
      toast.success(message);
      onSent();
      close();
    } catch (err) {
      // A native <dialog> sits above a toast, so the reason shows in the form too.
      const reason = extractApiError(err, "Could not send the notetaker");
      setFailure(reason);
      toast.error(reason);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Send the notetaker"
      description="Paste the Zoom, Google Meet or Teams link and the bot will join, record and write the meeting up."
      footer={
        <>
          <Button variant="ghost" onClick={close} disabled={busy}>
            Cancel
          </Button>
          <Button form="send-notetaker" type="submit" loading={busy} disabled={!meetingUrl.trim()}>
            Send it
          </Button>
        </>
      }
    >
      <form id="send-notetaker" onSubmit={submit} className="grid gap-4">
        {failure && <Alert>{failure}</Alert>}

        <TextField
          id="meeting-url"
          label="Meeting link"
          value={meetingUrl}
          onChange={(e) => setMeetingUrl(e.target.value)}
          placeholder="https://zoom.us/j/…"
          autoFocus
          required
        />
        <TextField
          id="meeting-title"
          label="What to call it"
          hint="Optional — used on the notes."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Customer sync"
        />
        <TextField
          id="starts-at"
          type="datetime-local"
          label="Join at"
          hint="Leave empty and it joins as soon as the call starts."
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
        />

        <div className="grid gap-1.5 rounded-xl border border-line bg-raised/40 p-3 text-xs text-muted">
          <p>
            <span className="font-medium text-ink">Everyone will see it.</span> The bot joins as &ldquo;Dexisphere
            Notetaker&rdquo; and announces itself. Make sure the people on the call are happy to be recorded — in some
            places everyone has to agree, not just you.
          </p>
          <p>
            <span className="font-medium text-ink">Recording time is billed.</span> The first 300 minutes each month
            are free; after that it costs tokens per recorded hour, charged on the call&apos;s real length.
          </p>
        </div>
      </form>
    </Modal>
  );
}
