"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buttonStyles } from "@/components/ui/button-styles";
import { Pill } from "@/components/ui/Pill";
import { Skeleton } from "@/components/ui/Skeleton";
import { macridAppLink } from "@/lib/config";
import type { ConnectionState, Connector } from "@/types/connector";

type ConnectorCardProps = {
  connector: Connector;
  connection: ConnectionState | undefined;
  loading: boolean;
  busy: boolean;
  onConnect: (connector: Connector) => void;
  onDisconnect: (connector: Connector) => void;
};

export function ConnectorCard({ connector, connection, loading, busy, onConnect, onDisconnect }: ConnectorCardProps) {
  const { Icon } = connector;
  const connected = connection?.status === "connected";

  const action = connected ? (
    connector.auth === "external" ? (
      <a href={macridAppLink(connector.manageHref ?? "/")} target="_blank" rel="noreferrer" className={buttonStyles({ variant: "secondary", size: "sm" })}>
        Manage in Macrid <ExternalLink className="size-3.5" />
      </a>
    ) : (
      <Button variant="secondary" size="sm" onClick={() => onDisconnect(connector)}>
        Disconnect
      </Button>
    )
  ) : connector.auth === "external" ? (
    <a href={macridAppLink(connector.manageHref ?? "/")} target="_blank" rel="noreferrer" className={buttonStyles({ size: "sm" })}>
      Set up in Macrid <ExternalLink className="size-3.5" />
    </a>
  ) : (
    <Button size="sm" loading={busy} onClick={() => onConnect(connector)}>
      {connector.auth === "api_key" ? "Add key" : "Connect"}
    </Button>
  );

  return (
    <article className="grid content-start gap-3 bg-surface p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-raised text-ink ring-1 ring-inset ring-line">
          <Icon className="size-4.5" />
        </span>
        <div className="grid min-w-0 flex-1 gap-0.5">
          <h3 className="font-sans text-[14.5px] font-semibold tracking-normal">{connector.name}</h3>
          {loading ? (
            <Skeleton className="mt-1 h-4 w-24 rounded-full" />
          ) : connected ? (
            <span className="flex min-w-0 items-center gap-2">
              <Pill tone="good" dot>Connected</Pill>
              {connection?.detail && <span className="truncate text-[12px] text-faint">{connection.detail}</span>}
            </span>
          ) : (
            <span className="text-[12px] text-faint">{connector.optional ? "Optional" : "Not connected"}</span>
          )}
        </div>
      </div>
      <p className="text-[13px] leading-relaxed text-muted">{connector.description}</p>
      <div className="mt-auto">{!loading && action}</div>
    </article>
  );
}
