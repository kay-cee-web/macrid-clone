"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { extractApiError, fieldErrors } from "@/lib/api/errors";
import { connectApiKey } from "@/services/connections";
import type { Connections, Connector } from "@/types/connector";
import { CredentialFields, initialValues, missingFields } from "./CredentialFields";

type ApiKeyModalProps = {
  connector: Connector;
  source: Connections["source"];
  onClose: () => void;
  onConnected: () => void;
};

/** A form built from the connector's own field list. */
export function ApiKeyModal({ connector, source, onClose, onConnected }: ApiKeyModalProps) {
  const fields = connector.fields ?? [];
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(fields));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const missing = missingFields(fields, values);
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
        <CredentialFields idPrefix={connector.key} fields={fields} values={values} errors={errors} onChange={set} />
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
