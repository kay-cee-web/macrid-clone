"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { TextField } from "@/components/ui/TextField";
import { extractApiError } from "@/lib/api/errors";
import { updateList } from "@/services/lists";
import type { RecordList } from "@/types/records";

/** Rename a list or change its description. The customers on it are untouched. */
export function ListEditModal({ list, onClose, onSaved }: { list: RecordList; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(list.name);
  const [description, setDescription] = useState(list.description);
  const [nameError, setNameError] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const fields = { name: name.trim(), description: description.trim() };
    if (!fields.name) return setNameError("Give the list a name.");

    setSaving(true);
    setError("");
    try {
      await updateList(list.id, fields);
      toast.success(`Saved “${fields.name}”.`);
      onSaved();
      onClose();
    } catch (err) {
      const reason = extractApiError(err, "Could not save the list");
      setError(reason);
      toast.error(reason);
      setSaving(false);
    }
  }

  return (
    <Modal open size="sm" onClose={onClose} title="Edit list" description="Rename it or change what it's for.">
      <form onSubmit={submit} className="grid gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        <TextField
          id="list-name"
          label="Name"
          autoComplete="off"
          value={name}
          error={nameError}
          onChange={(event) => {
            setName(event.target.value);
            setNameError("");
          }}
        />
        <Field id="list-description" label="Description">
          <Textarea
            id="list-description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
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
