"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { PasswordField, TextField } from "@/components/ui/TextField";
import { DEFAULT_PAYMENT_EVENTS, PAYMENT_EVENTS, SIGNS_WITH_KEY } from "@/data/connectors/payments";
import { useAsync } from "@/hooks/useAsync";
import { extractApiError } from "@/lib/api/errors";
import { fetchPaymentConnections, fetchPaymentWebhook, savePaymentNotifications } from "@/services/payments";
import type { PaymentConnection, PaymentWebhook } from "@/types/payment";
import type { Connector } from "@/types/connector";
import { WebhookLink } from "./WebhookLink";

type PaymentAlertsModalProps = { connector: Connector; connectionId: string; onClose: () => void; onSaved: () => void };

function AlertsForm({ connector, connectionId, connection, webhook, onClose, onSaved }: PaymentAlertsModalProps & {
  connection: PaymentConnection | undefined;
  webhook: PaymentWebhook;
}) {
  const saved = connection?.notify;
  const needsSecret = !SIGNS_WITH_KEY.includes(connector.key);
  const [secret, setSecret] = useState("");
  const [events, setEvents] = useState(saved?.notify_events.length ? saved.notify_events : DEFAULT_PAYMENT_EVENTS);
  const [phone, setPhone] = useState(saved?.notify_to ?? "");
  const [minimum, setMinimum] = useState(saved?.notify_min_amount?.toString() ?? "");
  const [saving, setSaving] = useState(false);
  // Shown in the form as well as toasted, since the dialog can cover a toast.
  const [failure, setFailure] = useState("");

  const toggle = (value: string, on: boolean) => setEvents((list) => (on ? [...list, value] : list.filter((v) => v !== value)));

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const message = await savePaymentNotifications(connectionId, {
        // Secrets are never read back, so a blank field keeps the saved one.
        ...(secret.trim() ? { webhook_secret: secret.trim() } : {}),
        notify_events: events,
        notify_channels: phone.trim() ? ["whatsapp"] : [],
        notify_to: phone.trim(),
        notify_min_amount: minimum.trim() ? Number(minimum) : null,
      });
      toast.success(message);
      onSaved();
      onClose();
    } catch (err) {
      const message = extractApiError(err, "Could not save the alerts");
      setFailure(message);
      toast.error(message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6" noValidate>
      <WebhookLink webhook={webhook} provider={connector.name} />
      {needsSecret && (
        <PasswordField
          id={`alerts-${connector.key}-secret`}
          label={`2. Paste ${connector.name}'s signing secret`}
          hint="It proves an alert really came from them. Without it, nothing is stored."
          placeholder={webhook.secretSet ? "Saved. Paste a new one to replace it." : "whsec_…"}
          autoComplete="off"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
      )}
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-medium">Tell me about</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {PAYMENT_EVENTS.map((e) => (
            <Checkbox key={e.value} id={`alerts-${connector.key}-${e.value}`} label={e.label}
              checked={events.includes(e.value)} onChange={(ev) => toggle(e.value, ev.target.checked)} />
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id={`alerts-${connector.key}-to`} label="WhatsApp number" type="tel" placeholder="+2348012345678"
          hint="Leave blank to keep alerts in the log only." value={phone} onChange={(e) => setPhone(e.target.value)} />
        <TextField id={`alerts-${connector.key}-min`} label="Only payments over" type="number" min={0} placeholder="1000"
          hint="Refunds and disputes always come through." value={minimum} onChange={(e) => setMinimum(e.target.value)} />
      </div>
      <p className="text-xs text-muted">
        WhatsApp only delivers an alert if you&apos;ve messaged our number in the last 24 hours, until the alert template is approved.
      </p>
      {failure && <Alert>{failure}</Alert>}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={saving}>Save alerts</Button>
      </div>
    </form>
  );
}

/** Live alerts for one payment account: the webhook to paste, the secret, and what to hear about. */
export function PaymentAlertsModal(props: PaymentAlertsModalProps) {
  const { connector, connectionId, onClose } = props;
  const loaded = useAsync(
    () => Promise.all([fetchPaymentWebhook(connectionId), fetchPaymentConnections()]),
    [connectionId],
    "Could not load the alert settings",
  );
  const [webhook, connections] = loaded.data ?? [];

  return (
    <Modal open onClose={onClose} size="lg" title={`${connector.name} alerts`}
      description="Hear the moment money arrives, a refund goes out or a dispute opens.">
      {loaded.status === "error" && <p role="alert" className="text-sm text-bad">{loaded.error}</p>}
      {loaded.status === "loading" && (
        <div className="grid gap-3" aria-busy>
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      )}
      {webhook && (
        <AlertsForm {...props} webhook={webhook} connection={connections?.find((c) => c.id === connectionId)} />
      )}
    </Modal>
  );
}
