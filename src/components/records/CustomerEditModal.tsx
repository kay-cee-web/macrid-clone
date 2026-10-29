"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { TextField } from "@/components/ui/TextField";
import { extractApiError } from "@/lib/api/errors";
import { statusLabel } from "@/lib/records/status";
import { updateLead, type CustomerFields } from "@/services/leads";
import type { Lead } from "@/types/records";

/** The statuses offered; a customer's own value is kept on top if it isn't one of them. */
const STATUSES = ["new", "not_contacted", "contacted", "booked", "closed"];

const TEXT_FIELDS: { key: Exclude<keyof CustomerFields, "status">; label: string; type?: string }[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "website", label: "Website", type: "url" },
  { key: "city", label: "City" },
  { key: "country", label: "Country" },
];

const fieldsOf = (lead: Lead): CustomerFields => ({
  name: lead.name === "Unknown" ? "" : lead.name,
  email: lead.email,
  phone: lead.phone,
  website: lead.website,
  city: lead.city,
  country: lead.country,
  status: lead.status,
});

/** Correct one customer's details. Only this customer changes; the list stays as it is. */
export function CustomerEditModal({ lead, onClose, onSaved }: { lead: Lead; onClose: () => void; onSaved: () => void }) {
  const [fields, setFields] = useState(() => fieldsOf(lead));
  const [invalid, setInvalid] = useState<Partial<Record<keyof CustomerFields, string>>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const statuses = STATUSES.some((s) => statusLabel(s) === statusLabel(lead.status)) || !lead.status ? STATUSES : [lead.status, ...STATUSES];

  function set(key: keyof CustomerFields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
    setInvalid((current) => ({ ...current, [key]: undefined }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.trim()])) as CustomerFields;
    const problems = {
      name: trimmed.name ? undefined : "Give the customer a name.",
      email: !trimmed.email || /^\S+@\S+\.\S+$/.test(trimmed.email) ? undefined : "That doesn't look like an email address.",
    };
    if (problems.name || problems.email) return setInvalid(problems);

    setSaving(true);
    setError("");
    try {
      await updateLead(lead.id, lead, trimmed);
      toast.success(`Saved “${trimmed.name}”.`);
      onSaved();
      onClose();
    } catch (err) {
      const reason = extractApiError(err, "Could not save the customer");
      setError(reason);
      toast.error(reason);
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title="Edit customer" description="Correct their details. Nothing is sent to them.">
      <form onSubmit={submit} className="grid gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        <div className="grid gap-4 sm:grid-cols-2">
          {TEXT_FIELDS.map(({ key, label, type }) => (
            <TextField
              key={key}
              id={`customer-${key}`}
              label={label}
              type={type}
              autoComplete="off"
              value={fields[key]}
              error={invalid[key]}
              onChange={(event) => set(key, event.target.value)}
            />
          ))}
        </div>
        <Field id="customer-status" label="Status">
          <Select id="customer-status" value={fields.status} onChange={(event) => set("status", event.target.value)}>
            {!fields.status && <option value="">No status</option>}
            {statuses.map((value) => (
              <option key={value} value={value}>
                {statusLabel(value)}
              </option>
            ))}
          </Select>
        </Field>
        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
