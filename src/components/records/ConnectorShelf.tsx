"use client";

import { ConnectorCard } from "@/components/plugins/ConnectorCard";
import { useConnectorFlows } from "@/components/plugins/ConnectorFlows";
import type { Connector } from "@/types/connector";

/**
 * The connectors a records page depends on, as the Plugins cards — connect,
 * fix or disconnect in place. Needs a `WorkspaceConnectorFlows` above it.
 */
export function ConnectorShelf({ connectors }: { connectors: Connector[] }) {
  const connections = useConnectorFlows()?.connections ?? null;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {connectors.map((connector) => (
        <ConnectorCard
          key={connector.key}
          connector={connector}
          connection={connections?.state[connector.key]}
          loading={!connections}
        />
      ))}
    </div>
  );
}
