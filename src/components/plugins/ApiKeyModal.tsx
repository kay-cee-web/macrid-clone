"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { extractApiError, fieldErrors } from "@/lib/api/errors";
import { connectApiKey } from "@/services/connections";
import type { Connections, Connector } from "@/types/connector";
import { CredentialFields, initialValues, missingFields } from "./CredentialFields";

type ApiKeyModalProps = {
  connector: Connector;
  source: Connections["source"];
  /** Dismissed without connecting. */
  onClose: () => void;
  /** Saved. The caller closes this dialog, or opens whatever comes next. */
  onConnected: () => void;
};

/** A form built from the connector's own field list. */
export function ApiKeyModal({ connector, source, onClose, onConnected }: ApiKeyModalProps) {
  const fields = connector.fields ?? [];
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(fields));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");

  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
    setFailure("");
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
    } catch (err) {
      // The backend checks the key before saving, so its reason ("no data centre
      // suffix… copy the whole key") is the one worth reading. It goes above the
      // fields as well as in a toast, which the dialog's top layer can cover.
      const message = extractApiError(err, `Could not connect ${connector.name}`);
      setErrors(fieldErrors(err));
      setFailure(message);
      toast.error(message);
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={`Connect ${connector.name}`} description={connector.description}>
      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        {failure && <Alert>{failure}</Alert>}
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
