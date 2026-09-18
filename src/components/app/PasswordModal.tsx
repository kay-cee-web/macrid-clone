"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PasswordField } from "@/components/ui/TextField";
import { extractApiError, fieldErrors } from "@/lib/api/errors";
import { changePassword } from "@/services/profile";

const MIN_LENGTH = 8;

/** Change the account password. The current one is checked by the API, not here. */
export function PasswordModal({ userId, onClose }: { userId: number; onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!current) return setErrors({ current: "Type your current password." });
    if (next.length < MIN_LENGTH) return setErrors({ next: `Use at least ${MIN_LENGTH} characters.` });
    if (next !== confirm) return setErrors({ confirm: "These two don't match." });

    setSaving(true);
    try {
      await changePassword(userId, current, next);
      toast.success("Password changed.");
      onClose();
    } catch (err) {
      const fields = fieldErrors(err);
      setErrors({ current: fields.current_password ?? "", next: fields.new_password ?? fields.password ?? "" });
      toast.error(extractApiError(err, "Could not change your password"));
      setSaving(false);
    }
  }

  return (
    <Modal
      open
      size="sm"
      onClose={onClose}
      title="Change password"
      description="You'll stay signed in on this device."
    >
      <form onSubmit={submit} className="grid gap-4" noValidate>
        <PasswordField
          id="current-password"
          label="Current password"
          autoComplete="current-password"
          value={current}
          error={errors.current}
          onChange={(event) => {
            setCurrent(event.target.value);
            setErrors({});
          }}
        />
        <PasswordField
          id="new-password"
          label="New password"
          autoComplete="new-password"
          hint={`At least ${MIN_LENGTH} characters.`}
          value={next}
          error={errors.next}
          onChange={(event) => {
            setNext(event.target.value);
            setErrors({});
          }}
        />
        <PasswordField
          id="confirm-password"
          label="Repeat new password"
          autoComplete="new-password"
          value={confirm}
          error={errors.confirm}
          onChange={(event) => {
            setConfirm(event.target.value);
            setErrors({});
          }}
        />
        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Change password
          </Button>
        </div>
      </form>
    </Modal>
  );
}
