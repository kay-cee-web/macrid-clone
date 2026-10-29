"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { statusTone } from "@/lib/records/status";
import { StatusCell } from "./cells";

type FailureReasonProps = {
  status: string;
  /** The backend's own words; the button shows on a failed row that has some. */
  reason: string;
  /** Names the record in the dialog, e.g. the campaign's subject. */
  title: string;
};

/**
 * A status pill with a "Reason" button beside it. The dialog shows the
 * backend's message exactly as sent: no rewording, no guessing at the cause.
 * Raised above `rowHref`'s full-row link, so the click opens the dialog.
 */
export function FailureReason({ status, reason, title }: FailureReasonProps) {
  const [open, setOpen] = useState(false);
  if (!reason || statusTone(status) !== "bad") return <StatusCell status={status} />;

  return (
    <span className="relative z-10 inline-flex items-center gap-2">
      <StatusCell status={status} />
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)} className="h-6 px-2 text-xs">
        Reason
      </Button>
      {open && (
        <Modal
          open
          onClose={() => setOpen(false)}
          title="Why it failed"
          description={title}
          footer={<Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>}
        >
          <p className="whitespace-pre-wrap break-words rounded-xl bg-bad-soft px-4 py-3 font-mono text-sm leading-relaxed text-bad">
            {reason}
          </p>
        </Modal>
      )}
    </span>
  );
}
