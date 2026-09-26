"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { CONNECTORS_BY_KEY } from "@/data/connectors";
import { useOAuthPopup } from "@/hooks/useOAuthPopup";
import { useWorkspaceConnections } from "@/hooks/useWorkspaceSetup";
import { extractApiError } from "@/lib/api/errors";
import { refreshSetup } from "@/lib/setup/store";
import { testPaymentConnection } from "@/services/payments";
import type { Connections, Connector } from "@/types/connector";
import { ConnectorDialogs, type Dialog } from "./ConnectorDialogs";

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
  /** Which list an email platform syncs with. */
  chooseList: (connector: Connector) => void;
};

const ConnectorFlowsContext = createContext<ConnectorFlows | null>(null);

/** Null outside a provider, where a connector's status shows without its buttons. */
export const useConnectorFlows = () => useContext(ConnectorFlowsContext);

/** `agentId`: the open agent, for its chat channels (Plugins inside an agent). */
type ProviderProps = { connections: Connections | null; onChanged: () => void; agentId?: string; children: ReactNode };

/**
 * Connecting and disconnecting in one place: the OAuth popup, the key forms and
 * the "are you sure?". Plugins wraps its catalogue in it; idea cards use
 * `WorkspaceConnectorFlows`. It holds the dialogs, so mount it once per page.
 */
export function ConnectorFlowsProvider({ connections, onChanged, agentId, children }: ProviderProps) {
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const source = connections?.source ?? "connectors";

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
      // Nothing to call yet. Say only that, not why — we'd be guessing at the
      // backend's state, and that guess belongs in a message to them, not here.
      if (connector.auth === "planned") toast.message(`${connector.name} is a work in progress.`);
      else if (connector.auth === "oauth") void oauth.connect(connector);
      else if (connector.store === "mailboxes") setDialog({ kind: "mailbox" });
      else setDialog({ kind: connector.store === "payments" ? "payment" : "key", connector });
    },
    disconnect: (connector) => setDialog({ kind: "disconnect", connector }),
    manageMailboxes: () => setDialog({ kind: "mailboxes" }),
    alerts: (connector) => setDialog({ kind: "alerts", connector }),
    chooseList: (connector) => setDialog({ kind: "list", connector }),
    test: async (connector) => {
      const id = connections?.state[connector.key]?.recordId ?? null;
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

  return (
    <ConnectorFlowsContext.Provider value={flows}>
      {children}
      {dialog && (
        <ConnectorDialogs
          dialog={dialog}
          connections={connections}
          source={source}
          setDialog={setDialog}
          onChanged={onChanged}
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
