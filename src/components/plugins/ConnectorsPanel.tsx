"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleAlert, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TileGrid } from "@/components/ui/TileGrid";
import { useWorkspace } from "@/components/workspace/WorkspaceContext";
import { CONNECTORS, CONNECTOR_CATEGORIES } from "@/data/connectors";
import { useAgentChannels } from "@/hooks/useAgentChannels";
import { useAsync } from "@/hooks/useAsync";
import { primeSetup } from "@/lib/setup/store";
import { fetchConnections } from "@/services/connections";
import type { Connections } from "@/types/connector";
import { ConnectorCard } from "./ConnectorCard";
import { ConnectorFlowsProvider } from "./ConnectorFlows";

/** Workspace connections every agent can use, grouped by who makes them, plus this agent's chat channels. */
export function ConnectorsPanel() {
  const { agent } = useWorkspace();
  const connections = useAsync(fetchConnections, [], "Could not load your connections");
  const channels = useAgentChannels(agent.id);
  const [query, setQuery] = useState("");

  // Idea cards and the chat's setup check read the same connections.
  useEffect(() => {
    if (connections.data) primeSetup(connections.data);
  }, [connections.data]);

  // The chat channels belong to this agent, so they join the cards here and nowhere else.
  const merged = useMemo<Connections | null>(
    () => connections.data && { ...connections.data, state: { ...connections.data.state, ...channels } },
    [connections.data, channels],
  );

  const q = query.trim().toLowerCase();
  const visible = CONNECTORS.filter((c) => !q || `${c.name} ${c.description}`.toLowerCase().includes(q));
  const loading = connections.status === "loading" && !connections.data;

  return (
    <ConnectorFlowsProvider connections={merged} onChanged={connections.reload} agentId={agent.id}>
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
          <div role="alert" className="flex items-center gap-3 rounded-xl bg-bad-soft px-4 py-3 text-sm text-bad">
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
            <section key={category.key} className="grid gap-4">
              <div className="grid gap-0.5">
                <h3 className="text-lg font-semibold">{category.label}</h3>
                <p className="text-sm text-muted">{category.blurb}</p>
              </div>
              <TileGrid className="gap-y-6">
                {items.map((connector) => (
                  <ConnectorCard
                    key={connector.key}
                    connector={connector}
                    connection={merged?.state[connector.key]}
                    loading={loading || (connector.auth === "channel" && !channels)}
                  />
                ))}
              </TileGrid>
            </section>
          );
        })}
        {!visible.length && <p className="text-sm text-muted">No connectors match “{query.trim()}”.</p>}
      </div>
    </ConnectorFlowsProvider>
  );
}
