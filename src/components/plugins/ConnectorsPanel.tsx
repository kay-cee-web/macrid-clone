"use client";

import { useEffect, useState } from "react";
import { CircleAlert, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { HairlineGrid } from "@/components/ui/HairlineGrid";
import { Input } from "@/components/ui/Input";
import { CONNECTORS, CONNECTOR_CATEGORIES } from "@/data/connectors";
import { useAsync } from "@/hooks/useAsync";
import { useOAuthPopup } from "@/hooks/useOAuthPopup";
import { extractApiError } from "@/lib/api/errors";
import { primeSetup } from "@/lib/setup/store";
import { disconnectConnector, fetchConnections } from "@/services/connections";
import type { Connector } from "@/types/connector";
import { ApiKeyModal } from "./ApiKeyModal";
import { ConnectorCard } from "./ConnectorCard";

/** Workspace connections every agent can use, grouped by what they're for. */
export function ConnectorsPanel() {
  const connections = useAsync(fetchConnections, [], "Could not load your connections");
  const [query, setQuery] = useState("");
  const [keyFor, setKeyFor] = useState<Connector | null>(null);
  const [disconnecting, setDisconnecting] = useState<Connector | null>(null);
  const source = connections.data?.source ?? "connectors";

  const oauth = useOAuthPopup(({ key, ok, message }) => {
    const name = CONNECTORS.find((c) => c.key === key)?.name ?? "The connection";
    if (ok) toast.success(message || `${name} connected.`);
    else if (message) toast.error(message);
    // The popup may have finished even if it closed without a message.
    connections.reload();
  });

  // Idea cards and the chat's setup check read the same connections.
  useEffect(() => {
    if (connections.data) primeSetup(connections.data);
  }, [connections.data]);

  const q = query.trim().toLowerCase();
  const visible = CONNECTORS.filter((c) => !q || `${c.name} ${c.description}`.toLowerCase().includes(q));
  const loading = connections.status === "loading" && !connections.data;

  const connect = (connector: Connector) =>
    connector.auth === "oauth" ? void oauth.connect(connector) : setKeyFor(connector);

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <p className="min-w-0 flex-1 basis-72 text-sm text-muted">
          Connections belong to your workspace, so every agent can use them.
        </p>
        <label htmlFor="connector-search" className="sr-only">Search connectors</label>
        <Input id="connector-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search connectors" leading={<Search />} className="h-9 w-full sm:w-64" />
      </div>

      {connections.status === "error" && (
        <div role="alert" className="flex items-center gap-3 rounded-[12px] bg-bad-soft px-4 py-3 text-sm text-bad">
          <CircleAlert className="size-4 shrink-0" />
          <span className="flex-1">{connections.error}</span>
          <Button size="sm" variant="secondary" onClick={connections.reload}>Try again</Button>
        </div>
      )}
      {connections.data?.problems.map((problem) => (
        <p key={problem} className="text-sm text-warn">{problem}</p>
      ))}

      {CONNECTOR_CATEGORIES.map((category) => {
        const items = visible.filter((c) => c.category === category.key);
        if (!items.length) return null;
        return (
          <section key={category.key} className="grid gap-3">
            <div className="grid gap-0.5">
              <h3 className="text-lg font-semibold">{category.label}</h3>
              <p className="text-sm text-muted">{category.blurb}</p>
            </div>
            <HairlineGrid itemCount={items.length}>
              {items.map((connector) => (
                <ConnectorCard
                  key={connector.key}
                  connector={connector}
                  connection={connections.data?.state[connector.key]}
                  loading={loading}
                  busy={oauth.pending === connector.key}
                  onConnect={connect}
                  onDisconnect={setDisconnecting}
                />
              ))}
            </HairlineGrid>
          </section>
        );
      })}
      {!visible.length && <p className="text-sm text-muted">No connectors match “{query.trim()}”.</p>}

      {keyFor && (
        <ApiKeyModal connector={keyFor} source={source} onClose={() => setKeyFor(null)} onConnected={connections.reload} />
      )}
      {disconnecting && (
        <ConfirmModal
          title={`Disconnect ${disconnecting.name}?`}
          description="Agents lose access to it until you connect it again."
          confirmLabel="Disconnect"
          onClose={() => setDisconnecting(null)}
          onConfirm={async () => {
            const connection = connections.data?.state[disconnecting.key];
            if (!connection) return false;
            try {
              toast.success(await disconnectConnector(disconnecting, connection, source));
              connections.reload();
              return true;
            } catch (err) {
              toast.error(extractApiError(err, `Could not disconnect ${disconnecting.name}`));
              return false;
            }
          }}
        />
      )}
    </div>
  );
}
