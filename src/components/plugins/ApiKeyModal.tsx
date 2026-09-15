"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { PasswordField, TextField } from "@/components/ui/TextField";
import { extractApiError, fieldErrors } from "@/lib/api/errors";
import { connectApiKey } from "@/services/connections";
import type { Connections, Connector } from "@/types/connector";

type ApiKeyModalProps = {
  connector: Connector;
  source: Connections["source"];
  onClose: () => void;
  onConnected: () => void;
};

/** A form built from the connector's own field list. */
export function ApiKeyModal({ connector, source, onClose, onConnected }: ApiKeyModalProps) {
  const fields = connector.fields ?? [];
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.options?.[0]?.value ?? ""])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const missing = Object.fromEntries(
      fields.filter((f) => f.required && !values[f.name]?.trim()).map((f) => [f.name, `Enter the ${f.label.toLowerCase()}.`]),
    );
    if (Object.keys(missing).length) return setErrors(missing);

    setSaving(true);
    try {
      const message = await connectApiKey(connector, values, source);
      toast.success(message);
      onConnected();
      onClose();
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(extractApiError(err, `Could not connect ${connector.name}`));
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={`Connect ${connector.name}`} description={connector.description}>
      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        {fields.map((field) => {
          const id = `${connector.key}-${field.name}`;
          const common = { id, label: field.label, error: errors[field.name], hint: field.help };
          if (field.type === "select") {
            return (
              <Field key={field.name} {...common}>
                <Select id={id} value={values[field.name]} onChange={(e) => set(field.name, e.target.value)}>
                  {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Select>
              </Field>
            );
          }
          const Input = field.type === "password" ? PasswordField : TextField;
          return (
            <Input
              key={field.name}
              {...common}
              type={field.type === "password" ? undefined : field.type}
              placeholder={field.placeholder}
              autoComplete="off"
              value={values[field.name]}
              onChange={(e) => set(field.name, e.target.value)}
            />
          );
        })}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Connect {connector.name}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
