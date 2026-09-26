"use client";

import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { LISTLESS } from "@/data/connectors/emailPlatforms";
import { extractApiError } from "@/lib/api/errors";
import { disconnectWarning } from "@/lib/connections/warnings";
import { disconnectConnector } from "@/services/connections";
import type { Connections, Connector } from "@/types/connector";
import { ApiKeyModal } from "./ApiKeyModal";
import { EmailPlatformListModal } from "./EmailPlatformListModal";
import { MailboxesModal } from "./MailboxesModal";
import { MailboxModal } from "./MailboxModal";
import { PaymentAlertsModal } from "./PaymentAlertsModal";
import { PaymentConnectModal } from "./PaymentConnectModal";

/** Every dialog `ConnectorFlowsProvider` can have open. One at a time. */
export type Dialog =
  | { kind: "key" | "payment" | "alerts" | "list" | "disconnect"; connector: Connector }
  | { kind: "mailbox" | "mailboxes" };

type Props = {
  dialog: Dialog;
  connections: Connections | null;
  source: Connections["source"];
  setDialog: (dialog: Dialog | null) => void;
  onChanged: () => void;
};

/** An email platform that syncs with a list has to be pointed at one. Systeme.io doesn't. */
const needsList = (connector: Connector) =>
  connector.store === "email_platforms" && !LISTLESS.includes(connector.key);

export function ConnectorDialogs({ dialog, connections, source, setDialog, onChanged }: Props) {
  const close = () => setDialog(null);
  const stateOf = (connector: Connector) => connections?.state[connector.key];

  if (dialog.kind === "key") {
    const { connector } = dialog;
    return (
      <ApiKeyModal
        connector={connector}
        source={source}
        onClose={close}
        onConnected={() => {
          onChanged();
          // An email platform can't sync until a list is chosen, so go straight
          // there rather than closing on a card that says something's wrong.
          if (needsList(connector)) setDialog({ kind: "list", connector });
          else close();
        }}
      />
    );
  }

  if (dialog.kind === "list") {
    return <EmailPlatformListModal connector={dialog.connector} onClose={close} onSaved={onChanged} />;
  }

  if (dialog.kind === "payment") {
    return <PaymentConnectModal connector={dialog.connector} onClose={close} onConnected={onChanged} />;
  }

  if (dialog.kind === "alerts") {
    const id = stateOf(dialog.connector)?.recordId;
    if (!id) return null;
    return <PaymentAlertsModal connector={dialog.connector} connectionId={id} onClose={close} onSaved={onChanged} />;
  }

  if (dialog.kind === "mailbox") return <MailboxModal onClose={close} onConnected={onChanged} />;

  if (dialog.kind === "mailboxes") {
    return <MailboxesModal onClose={close} onAdd={() => setDialog({ kind: "mailbox" })} onChanged={onChanged} />;
  }

  if (dialog.kind !== "disconnect") return null;
  const { connector } = dialog;
  const connection = stateOf(connector);
  return (
    <ConfirmModal
      title={`Disconnect ${connector.name}?`}
      description={disconnectWarning(connector, connection?.detail ?? "")}
      confirmLabel="Disconnect"
      onClose={close}
      onConfirm={async () => {
        if (!connection) return false;
        try {
          toast.success(await disconnectConnector(connector, connection, source));
          return true;
        } catch (err) {
          toast.error(extractApiError(err, `Could not disconnect ${connector.name}`));
          return false;
        } finally {
          // Senders go one at a time, so even a failure may have changed something.
          onChanged();
        }
      }}
    />
  );
}
