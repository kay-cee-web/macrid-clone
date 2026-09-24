"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { Switch } from "@/components/ui/Switch";
import { HAS_SANDBOX } from "@/data/connectors/payments";
import { useAsync } from "@/hooks/useAsync";
import { extractApiError, fieldErrors } from "@/lib/api/errors";
import { connectPayment, fetchPaymentProviders } from "@/services/payments";
import type { Connector, ConnectorField } from "@/types/connector";
import { CredentialFields, initialValues, missingFields } from "./CredentialFields";

type PaymentConnectModalProps = { connector: Connector; onClose: () => void; onConnected: () => void };

/** Laravel names a nested field `credentials.secret_key`; the form knows it as `secret_key`. */
const unnest = (errors: Record<string, string>) =>
  Object.fromEntries(Object.entries(errors).map(([key, value]) => [key.replace(/^credentials\./, ""), value]));

function PaymentForm({ connector, provider, fields, onClose, onConnected }: PaymentConnectModalProps & {
  provider: string;
  fields: ConnectorField[];
}) {
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(fields));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [live, setLive] = useState(true);
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
      const credentials = Object.fromEntries(fields.map((f) => [f.name, values[f.name].trim()]));
      toast.success(await connectPayment(provider, credentials, live, connector.name));
      onConnected();
      onClose();
    } catch (err) {
      // The backend tries the key before saving, so a wrong one lands here as a 422
      // `{status: false, message: "Stripe 401: Invalid API Key provided: …"}`. Its
      // words go in the form as well as the toast, since the dialog can cover a toast.
      const message = extractApiError(err, `Could not connect ${connector.name}`);
      setErrors(unnest(fieldErrors(err)));
      setFailure(message);
      toast.error(message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <CredentialFields idPrefix={`pay-${connector.key}`} fields={fields} values={values} errors={errors} onChange={set} />
      {HAS_SANDBOX.includes(connector.key) && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-line px-3 py-2.5">
          <span className="grid gap-0.5">
            <span className="text-sm font-medium">Live account</span>
            <span className="text-xs text-muted">Turn off to read a sandbox account instead.</span>
          </span>
          <Switch id={`pay-${connector.key}-live`} label="Live account" checked={live} onChange={setLive} />
        </div>
      )}
      {failure && (
        <p role="alert" className="rounded-xl bg-bad-soft px-3 py-2 text-sm text-bad">{failure}</p>
      )}
      <p className="text-xs text-muted">
        Read-only: agents can see payments, never refund or charge. We check the key works before saving it, and it&apos;s never shown again.
      </p>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={saving}>Connect {connector.name}</Button>
      </div>
    </form>
  );
}

/** A payment account's key form, built from GET /payments/providers, or the connector's own fields if that fails. */
export function PaymentConnectModal(props: PaymentConnectModalProps) {
  const { connector, onClose } = props;
  const providers = useAsync(fetchPaymentProviders, [], "Could not load the payment providers");
  const provider = providers.data?.find((p) => p.key === connector.key);
  const fields = provider?.fields.length ? provider.fields : connector.fields ?? [];
  const ready = providers.status !== "loading";

  return (
    <Modal open onClose={onClose} title={`Connect ${connector.name}`} description={provider?.help || connector.description}>
      {ready ? (
        // Keyed on the field list, so the form starts fresh with the fields it will send.
        <PaymentForm key={fields.map((f) => f.name).join()} {...props} provider={provider?.apiKey || connector.key} fields={fields} />
      ) : (
        <div className="grid gap-3" aria-busy>
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      )}
    </Modal>
  );
}
