"use client";

import { useState, type ReactNode } from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";

type ConfirmModalProps = {
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  /** Resolve true to close; false (or throw) keeps the dialog open. */
  onConfirm: () => Promise<boolean>;
  onClose: () => void;
};

/** "Are you sure?" with a busy state while the action runs. Mount it only while open. */
export function ConfirmModal({
  title, description, confirmLabel, cancelLabel = "Cancel", tone = "danger", onConfirm, onClose,
}: ConfirmModalProps) {
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    const done = await onConfirm().catch(() => false);
    if (done) onClose();
    else setBusy(false);
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="sm"
      title={title}
      description={description}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={tone} loading={busy} onClick={() => void confirm()}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
