"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import { extractApiError } from "@/lib/api/errors";
import { redeemLicence } from "@/services/billing";

const MIN_LENGTH = 4;

/**
 * Applying a licence bought on the pricing site. There is no card payment in
 * the product: checkout hands over a code and `POST /upgrade-account` is what
 * turns it into allowances, so the panel re-reads `/package` afterwards rather
 * than guessing what the code granted.
 */
export function RedeemModal({ onClose, onRedeemed }: { onClose: () => void; onRedeemed: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const value = code.trim();
    if (value.length < MIN_LENGTH) return setError("Type the code from your receipt.");

    setSaving(true);
    try {
      await redeemLicence(value);
      toast.success("Licence applied. Your new allowances are live.");
      onRedeemed();
      onClose();
    } catch (err) {
      const reason = extractApiError(err, "Could not redeem that code");
      setError(reason);
      toast.error(reason);
      setSaving(false);
    }
  }

  return (
    <Modal
      open
      size="sm"
      onClose={onClose}
      title="Redeem a licence code"
      description="Bought a licence? Enter the code and your allowances update straight away."
    >
      <form onSubmit={submit} className="grid gap-4" noValidate>
        <TextField
          id="licence-code"
          label="Licence code"
          placeholder="XXXX-XXXX-XXXX"
          autoComplete="off"
          spellCheck={false}
          className="font-mono"
          value={code}
          error={error}
          onChange={(event) => {
            setCode(event.target.value);
            setError("");
          }}
        />
        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Redeem
          </Button>
        </div>
      </form>
    </Modal>
  );
}
