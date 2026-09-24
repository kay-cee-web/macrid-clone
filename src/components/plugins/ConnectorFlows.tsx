"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { CONNECTORS_BY_KEY } from "@/data/connectors";
import { useOAuthPopup } from "@/hooks/useOAuthPopup";
import { useWorkspaceConnections } from "@/hooks/useWorkspaceSetup";
import { extractApiError } from "@/lib/api/errors";
import { disconnectWarning } from "@/lib/connections/warnings";
import { refreshSetup } from "@/lib/setup/store";
import { disconnectConnector } from "@/services/connections";
import { testPaymentConnection } from "@/services/payments";
import type { Connections, Connector } from "@/types/connector";
import { ApiKeyModal } from "./ApiKeyModal";
import { MailboxesModal } from "./MailboxesModal";
import { MailboxModal } from "./MailboxModal";
import { PaymentAlertsModal } from "./PaymentAlertsModal";
import { PaymentConnectModal } from "./PaymentConnectModal";

type ConnectorFlows = {
  /** Set inside an agent: WhatsApp and Telegram pair in its settings. */
  agentId?: string;
  connections: Connections | null;
  /** The connector whose popup is open or whose test is running. */
  pending: string | null;
  connect: (connector: Connector) => void;
  disconnect: (connector: Connector) => void;
  /** The mailbox list: test or remove one at a time. */
  manageMailboxes: () => void;
  /** A payment account's webhook and alert settings. */
  alerts: (connector: Connector) => void;
  /** Ask the backend to try a payment account's key again. */
  test: (connector: Connector) => void;
};

const ConnectorFlowsContext = createContext<ConnectorFlows | null>(null);

/** Null outside a provider, where a connector's status shows without its buttons. */
export const useConnectorFlows = () => useContext(ConnectorFlowsContext);

/** `agentId`: the open agent, for its chat channels (Plugins inside an agent). */
type ProviderProps = { connections: Connections | null; onChanged: () => void; agentId?: string; children: ReactNode };
type Dialog = { kind: "key" | "payment" | "alerts" | "disconnect"; connector: Connector } | { kind: "mailbox" | "mailboxes" };

/**
 * Connecting and disconnecting in one place: the OAuth popup, the key forms and
 * the "are you sure?". Plugins wraps its catalogue in it; idea cards use
 * `WorkspaceConnectorFlows`. It holds the dialogs, so mount it once per page.
 */
export function ConnectorFlowsProvider({ connections, onChanged, agentId, children }: ProviderProps) {
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const source = connections?.source ?? "connectors";
  const close = () => setDialog(null);
  const recordOf = (connector: Connector) => connections?.state[connector.key]?.recordId ?? null;

  const oauth = useOAuthPopup(({ key, ok, message }) => {
    const name = CONNECTORS_BY_KEY[key]?.name ?? "The connection";
    if (ok) toast.success(message || `${name} connected.`);
    else if (message) toast.error(message);
    // The popup may have finished even if it closed without a message.
    onChanged();
  });

  const flows: ConnectorFlows = {
    connections,
    agentId,
    pending: oauth.pending ?? testing,
    // OAuth opens its popup synchronously, inside the click, so blockers allow it.
    connect: (connector) => {
      if (connector.auth === "oauth") void oauth.connect(connector);
      else if (connector.store === "mailboxes") setDialog({ kind: "mailbox" });
      else setDialog({ kind: connector.store === "payments" ? "payment" : "key", connector });
    },
    disconnect: (connector) => setDialog({ kind: "disconnect", connector }),
    manageMailboxes: () => setDialog({ kind: "mailboxes" }),
    alerts: (connector) => setDialog({ kind: "alerts", connector }),
    test: async (connector) => {
      const id = recordOf(connector);
      if (!id) return;
      setTesting(connector.key);
      try {
        toast.success(await testPaymentConnection(id, connector.name));
      } catch (err) {
        toast.error(extractApiError(err, `${connector.name} didn't answer`));
      } finally {
        setTesting(null);
        onChanged();
      }
    },
  };

  const connection = dialog?.kind === "disconnect" ? connections?.state[dialog.connector.key] : undefined;
  const alertsId = dialog?.kind === "alerts" ? recordOf(dialog.connector) : null;

  return (
    <ConnectorFlowsContext.Provider value={flows}>
      {children}
      {dialog?.kind === "key" && (
        <ApiKeyModal connector={dialog.connector} source={source} onClose={close} onConnected={onChanged} />
      )}
      {dialog?.kind === "payment" && (
        <PaymentConnectModal connector={dialog.connector} onClose={close} onConnected={onChanged} />
      )}
      {dialog?.kind === "alerts" && alertsId && (
        <PaymentAlertsModal connector={dialog.connector} connectionId={alertsId} onClose={close} onSaved={onChanged} />
      )}
      {dialog?.kind === "mailbox" && <MailboxModal onClose={close} onConnected={onChanged} />}
      {dialog?.kind === "mailboxes" && (
        <MailboxesModal onClose={close} onAdd={() => setDialog({ kind: "mailbox" })} onChanged={onChanged} />
      )}
      {dialog?.kind === "disconnect" && (
        <ConfirmModal
          title={`Disconnect ${dialog.connector.name}?`}
          description={disconnectWarning(dialog.connector, connection?.detail ?? "")}
          confirmLabel="Disconnect"
          onClose={close}
          onConfirm={async () => {
            if (!connection) return false;
            try {
              toast.success(await disconnectConnector(dialog.connector, connection, source));
              return true;
            } catch (err) {
              toast.error(extractApiError(err, `Could not disconnect ${dialog.connector.name}`));
              return false;
            } finally {
              // Senders go one at a time, so even a failure may have changed something.
              onChanged();
            }
          }}
        />
      )}
    </ConnectorFlowsContext.Provider>
  );
}

/** For idea cards: the workspace's shared connections, read again after every change. */
export function WorkspaceConnectorFlows({ children }: { children: ReactNode }) {
  const connections = useWorkspaceConnections();
  return (
    <ConnectorFlowsProvider connections={connections} onChanged={() => void refreshSetup()}>
      {children}
    </ConnectorFlowsProvider>
  );
}
