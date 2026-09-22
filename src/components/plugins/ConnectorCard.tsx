"use client";

import { Pill } from "@/components/ui/Pill";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ConnectionState, Connector } from "@/types/connector";
import { ConnectorActions } from "./ConnectorActions";
import { ConnectorLogo } from "./ConnectorLogo";

type ConnectorCardProps = {
  connector: Connector;
  connection: ConnectionState | undefined;
  loading: boolean;
};

/** The label under the name when nothing is connected yet. */
function idleLabel(connector: Connector, connection: ConnectionState | undefined) {
  if (connector.auth === "planned") return "Coming soon";
  if (connector.auth === "external" && connection?.status === "unknown") return "Not set up";
  return connector.optional ? "Optional" : "Not connected";
}

/** One connector in the Plugins catalogue. Its buttons come from `ConnectorActions`, inside a `ConnectorFlowsProvider`. */
export function ConnectorCard({ connector, connection, loading }: ConnectorCardProps) {
  const connected = connector.auth !== "planned" && connection?.status === "connected";

  return (
    <article className="group flex h-full flex-col gap-4 rounded-3xl border border-line bg-raised/40 p-6 backdrop-blur transition-[background-color,box-shadow] duration-200 hover:bg-raised/80 hover:shadow-float">
      <div className="flex items-start gap-3">
        <ConnectorLogo connector={connector} className="size-11 rounded-2xl" />
        <div className="grid min-w-0 flex-1 gap-1.5">
          <h3 className="truncate font-sans text-lg font-medium tracking-normal text-ink">{connector.name}</h3>
          {loading ? (
            <Skeleton className="h-5 w-24 rounded-full" />
          ) : (
            <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              {connected ? <Pill tone="good" dot>Connected</Pill> : <Pill>{idleLabel(connector, connection)}</Pill>}
              {connected && connection?.detail && (
                <span className="truncate font-mono text-xs text-faint">{connection.detail}</span>
              )}
            </span>
          )}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted">{connector.description}</p>

      {/* mt-auto lines the buttons up across a row, however tall each card runs. */}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        {loading ? <Skeleton className="h-8 w-24 rounded-lg" /> : <ConnectorActions connector={connector} />}
      </div>
    </article>
  );
}
