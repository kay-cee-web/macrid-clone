"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Field } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { PasswordField, TextField } from "@/components/ui/TextField";
import { useAsync } from "@/hooks/useAsync";
import { extractApiError, fieldErrors } from "@/lib/api/errors";
import { createMailbox, fetchMailboxProviders, type MailboxInput } from "@/services/mailboxes";
import { MailboxProviderHelp } from "./MailboxProviderHelp";

const ENCRYPTION = [
  { value: "ssl", label: "SSL" },
  { value: "tls", label: "STARTTLS" },
  { value: "none", label: "None" },
];

type Values = Required<Omit<MailboxInput, "validate_cert">> & { selfSigned: boolean };
const EMPTY: Values = { provider: "", email: "", password: "", host: "", port: "993", encryption: "ssl", selfSigned: false };

/**
 * Connect a mailbox for reading: pick the provider, then an address and an
 * app password. The backend logs in before it saves, so a success here is a
 * mailbox that already works.
 */
export function MailboxModal({ onClose, onConnected }: { onClose: () => void; onConnected: () => void }) {
  const providers = useAsync(fetchMailboxProviders, [], "Could not load the mail providers");
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const list = providers.data ?? [];
  const provider = list.find((p) => p.key === values.provider) ?? list[0];
  const custom = Boolean(provider?.custom);

  const set = <K extends keyof Values>(name: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!provider) return;
    const missing: Record<string, string> = {};
    if (!values.email.trim()) missing.email = "Enter the email address.";
    if (!values.password.trim()) missing.password = "Paste the app password.";
    if (custom && !values.host.trim()) missing.host = "Enter the IMAP host.";
    if (Object.keys(missing).length) return setErrors(missing);

    setSaving(true);
    try {
      const { selfSigned, ...rest } = values;
      const input: MailboxInput = { ...rest, provider: provider.key, email: rest.email.trim() };
      if (custom) input.validate_cert = !selfSigned;
      toast.success(await createMailbox(input));
      onConnected();
      onClose();
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(extractApiError(err, "Could not connect the mailbox"));
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title="Connect a mailbox" description="Agents read your mail through it. It never sends.">
      {providers.status === "error" ? (
        <div role="alert" className="grid justify-items-start gap-3 text-sm text-bad">
          {providers.error}
          <Button size="sm" variant="secondary" onClick={providers.reload}>Try again</Button>
        </div>
      ) : !provider ? (
        <div className="grid gap-3"><Skeleton className="h-10" /><Skeleton className="h-24" /><Skeleton className="h-10" /></div>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-4" noValidate>
          <Field id="mailbox-provider" label="Provider">
            <Select id="mailbox-provider" value={provider.key} onChange={(e) => set("provider", e.target.value)}>
              {list.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
            </Select>
          </Field>
          <MailboxProviderHelp provider={provider} />
          <TextField id="mailbox-email" label="Email address" type="email" autoComplete="off" error={errors.email}
            value={values.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" />
          {/* "new-password": Chrome ignores "off" and fills the account's own login in here. */}
          <PasswordField id="mailbox-password" label={custom ? "Password" : "App password"} autoComplete="new-password"
            error={errors.password} value={values.password} onChange={(e) => set("password", e.target.value)}
            hint={custom ? undefined : "Paste it as shown. Spaces are fine."} />
          {custom && (
            <>
              <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
                <TextField id="mailbox-host" label="IMAP host" placeholder="imap.example.com" error={errors.host}
                  value={values.host} onChange={(e) => set("host", e.target.value)} />
                <TextField id="mailbox-port" label="Port" type="number" error={errors.port}
                  value={values.port} onChange={(e) => set("port", e.target.value)} />
              </div>
              <Field id="mailbox-encryption" label="Encryption" error={errors.encryption}>
                <Select id="mailbox-encryption" value={values.encryption} onChange={(e) => set("encryption", e.target.value)}>
                  {ENCRYPTION.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Select>
              </Field>
              <Checkbox id="mailbox-self-signed" label="The server uses a self-signed certificate"
                checked={values.selfSigned} onChange={(e) => set("selfSigned", e.target.checked)} />
            </>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={saving}>{saving ? "Testing the login…" : "Connect mailbox"}</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
