"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { eventsFor, modeOf } from "@/data/connectors/workTools";
import { useAsync } from "@/hooks/useAsync";
import { extractApiError, fieldErrors } from "@/lib/api/errors";
import { connectWorkTool, fetchWorkToolProviders } from "@/services/workTools";
import type { Connections, Connector, ConnectorField } from "@/types/connector";
import type { WorkToolEvent } from "@/types/workTool";
import { CredentialFields, initialValues, missingFields } from "./CredentialFields";
import { useConnectorFlows } from "./ConnectorFlows";
import { WorkToolWatchFields, notifyChannelsIn } from "./WorkToolWatchFields";

type Props = { connector: Connector; onClose: () => void; onConnected: () => void };
type FormProps = Props & { fields: ConnectorField[]; events: WorkToolEvent[]; connections: Connections | null };

/** Laravel names a nested field `credentials.token`; the form knows it as `token`. */
const unnest = (errors: Record<string, string>) =>
  Object.fromEntries(Object.entries(errors).map(([key, value]) => [key.replace(/^credentials\./, ""), value]));

function WorkToolForm({ connector, fields, events, connections, onClose, onConnected }: FormProps) {
  const watching = modeOf(connector.key) === "watch";
  const channels = notifyChannelsIn(connections);
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(fields));
  const [watch, setWatch] = useState<string[]>(() => events.slice(0, 1).map((event) => event.value));
  const [notify, setNotify] = useState(() => channels[0]?.value ?? "");
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
      const credentials = Object.fromEntries(fields.map((f) => [f.name, values[f.name].trim()]));
      const setup = watching ? { credentials, watch, notifyChannel: notify } : { credentials };
      toast.success(await connectWorkTool(connector.key, setup, connector.name));
      onConnected();
      onClose();
    } catch (err) {
      // The credentials are tried before they're saved, so a bad one lands here.
      // Its words go in the form as well as the toast, since the dialog can cover one.
      const message = extractApiError(err, `Could not connect ${connector.name}`);
      setErrors(unnest(fieldErrors(err)));
      setFailure(message);
      toast.error(message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <CredentialFields idPrefix={`work-${connector.key}`} fields={fields} values={values} errors={errors} onChange={set} />
      {watching && (
        <WorkToolWatchFields
          idPrefix={`work-${connector.key}`}
          events={events}
          watch={watch}
          onWatch={setWatch}
          channels={channels}
          notify={notify}
          onNotify={setNotify}
          error={errors.notify_channel}
        />
      )}
      {failure && <Alert>{failure}</Alert>}
      <p className="text-xs text-muted">
        {watching
          ? "Read-only: agents report what changed, and never write anything back. The first check only marks where you are now, so you'll hear about what happens next rather than everything already waiting."
          : `Connecting posts a short test message to ${connector.name}, so you can see it works straight away.`}
      </p>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={saving}>Connect {connector.name}</Button>
      </div>
    </form>
  );
}

/**
 * A work tool's key form, built from GET /work-tools/providers, or the
 * connector's own fields if that fails. A watcher also picks what it reports and
 * where, because the backend refuses to save one with nowhere to report.
 */
export function WorkToolConnectModal(props: Props) {
  const { connector, onClose } = props;
  const flows = useConnectorFlows();
  const providers = useAsync(fetchWorkToolProviders, [], "Could not load the work tools");
  const provider = providers.data?.find((p) => p.key === connector.key);
  const fields = provider?.fields.length ? provider.fields : connector.fields ?? [];
  const events = provider?.events.length ? provider.events : eventsFor(connector.key);

  return (
    <Modal open onClose={onClose} title={`Connect ${connector.name}`} description={provider?.help || connector.description}>
      {providers.status === "loading" ? (
        <div className="grid gap-3" aria-busy>
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : (
        // Keyed on the field list, so the form starts fresh with the fields it will send.
        <WorkToolForm
          key={fields.map((f) => f.name).join()}
          {...props}
          fields={fields}
          events={events}
          connections={flows?.connections ?? null}
        />
      )}
    </Modal>
  );
}
