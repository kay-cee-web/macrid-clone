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

/**
 * Three states, and only three: Not connected, Connected, Needs attention. The
 * last is the one that matters: a connection that broke quietly is the failure
 * users blame the product for. A connector whose route isn't built yet is still
 * just Not connected — pressing Connect is what says so, and `note` carries any
 * standing requirement.
 */
function Badge({ connection }: { connection: ConnectionState | undefined }) {
  if (connection?.status === "attention") return <Pill tone="warn" dot>Needs attention</Pill>;
  if (connection?.status === "connected") return <Pill tone="good" dot>Connected</Pill>;
  return <Pill>Not connected</Pill>;
}

/** One connector in the Plugins catalogue. Its buttons come from `ConnectorActions`, inside a `ConnectorFlowsProvider`. */
export function ConnectorCard({ connector, connection, loading }: ConnectorCardProps) {
  const status = connection?.status;
  const detail = status === "connected" || status === "attention" ? connection?.detail : "";

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
              <Badge connection={connection} />
              {status === "connected" && detail && <span className="truncate font-mono text-xs text-faint">{detail}</span>}
            </span>
          )}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted">{connector.description}</p>
      {/* What broke, in the backend's words, where the user will look before pressing anything. */}
      {status === "attention" && detail && (
        <p className="rounded-xl bg-warn-soft px-3 py-2 text-sm text-warn">{detail}</p>
      )}

      {/* mt-auto lines the buttons up across a row, however tall each card runs. */}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        {loading ? <Skeleton className="h-8 w-24 rounded-lg" /> : <ConnectorActions connector={connector} />}
      </div>
    </article>
  );
}
