"use client";

import { useId, useState, type HTMLInputTypeAttribute } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { extractApiError } from "@/lib/api/errors";
import { SettingRow } from "./SettingsSection";

type EditableRowProps = {
  label: string;
  description: string;
  value: string;
  /** Shown in place of an empty value. */
  empty?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  /** Rejects an empty value, for fields the API insists on. */
  required?: boolean;
  onSave: (value: string) => Promise<void>;
};

/** A settings row that swaps its value for a field, saves, and closes. */
export function EditableRow({
  label, description, value, empty = "Nothing here", placeholder, type = "text", required, onSave,
}: EditableRowProps) {
  const id = useId();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const open = () => {
    setDraft(value);
    setError("");
    setEditing(true);
  };

  async function save() {
    const next = draft.trim();
    if (required && !next) return setError(`${label} can't be empty.`);
    if (next === value.trim()) return setEditing(false);
    setSaving(true);
    try {
      await onSave(next);
      setEditing(false);
    } catch (err) {
      setError(extractApiError(err, `Could not save your ${label.toLowerCase()}`));
    }
    setSaving(false);
  }

  return (
    <SettingRow label={label} description={description} htmlFor={editing ? id : undefined}>
      {editing ? (
        <div className="grid w-full gap-1.5 sm:w-72">
          <div className="flex items-center gap-2">
            <Input
              id={id}
              type={type}
              autoFocus
              value={draft}
              placeholder={placeholder}
              invalid={Boolean(error)}
              onChange={(event) => {
                setDraft(event.target.value);
                setError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") void save();
                if (event.key === "Escape") setEditing(false);
              }}
            />
            <Button size="sm" loading={saving} onClick={() => void save()}>
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
          {error && (
            <p role="alert" className="text-xs text-bad">
              {error}
            </p>
          )}
        </div>
      ) : (
        <>
          <span className={value ? "truncate text-sm text-ink" : "text-sm text-faint"}>{value || empty}</span>
          <Button variant="secondary" size="sm" iconRight={<Pencil className="size-3.5" />} onClick={open}>
            Edit
          </Button>
        </>
      )}
    </SettingRow>
  );
}
