"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { CONNECTORS_BY_KEY } from "@/data/connectors";
import { useOAuthPopup } from "@/hooks/useOAuthPopup";
import { useWorkspaceConnections } from "@/hooks/useWorkspaceSetup";
import { extractApiError } from "@/lib/api/errors";
import { refreshSetup } from "@/lib/setup/store";
import { disconnectConnector } from "@/services/connections";
import type { Connections, Connector } from "@/types/connector";
import { ApiKeyModal } from "./ApiKeyModal";

type ConnectorFlows = {
  connections: Connections | null;
  /** The OAuth connector whose consent popup is open. */
  pending: string | null;
  connect: (connector: Connector) => void;
  disconnect: (connector: Connector) => void;
};

const ConnectorFlowsContext = createContext<ConnectorFlows | null>(null);

/** Null outside a provider, where a connector's status shows without its buttons. */
export const useConnectorFlows = () => useContext(ConnectorFlowsContext);

/** What disconnecting takes away, said before it happens. */
function disconnectWarning(connector: Connector, detail: string) {
  const which = detail ? ` (${detail})` : "";
  if (connector.store === "mail_accounts") {
    return `Every mailbox connected here is removed${which}. Agents can't send email from them until you add one again.`;
  }
  if (connector.store === "sms_senders") {
    return `Your Twilio sender is removed${which}, and texts go back out on Dexisphere's shared sender.`;
  }
  return "Agents lose access to it until you connect it again.";
}

type ProviderProps = { connections: Connections | null; onChanged: () => void; children: ReactNode };

/**
 * Connecting and disconnecting in one place: the OAuth popup, the key form and
 * the "are you sure?". Plugins wraps its catalogue in it; idea cards use
 * `WorkspaceConnectorFlows`. It holds the dialogs, so mount it once per page.
 */
export function ConnectorFlowsProvider({ connections, onChanged, children }: ProviderProps) {
  const [keyFor, setKeyFor] = useState<Connector | null>(null);
  const [disconnecting, setDisconnecting] = useState<Connector | null>(null);
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
    pending: oauth.pending,
    // OAuth opens its popup synchronously, inside the click, so blockers allow it.
    connect: (connector) => (connector.auth === "oauth" ? void oauth.connect(connector) : setKeyFor(connector)),
    disconnect: setDisconnecting,
  };
  const connection = disconnecting ? connections?.state[disconnecting.key] : undefined;

  return (
    <ConnectorFlowsContext.Provider value={flows}>
      {children}
      {keyFor && <ApiKeyModal connector={keyFor} source={source} onClose={() => setKeyFor(null)} onConnected={onChanged} />}
      {disconnecting && (
        <ConfirmModal
          title={`Disconnect ${disconnecting.name}?`}
          description={disconnectWarning(disconnecting, connection?.detail ?? "")}
          confirmLabel="Disconnect"
          onClose={() => setDisconnecting(null)}
          onConfirm={async () => {
            if (!connection) return false;
            try {
              toast.success(await disconnectConnector(disconnecting, connection, source));
              return true;
            } catch (err) {
              toast.error(extractApiError(err, `Could not disconnect ${disconnecting.name}`));
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
