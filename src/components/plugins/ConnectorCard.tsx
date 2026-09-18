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

/** The label under the name when nothing is connected yet. */
function idleLabel(connector: Connector, connection: ConnectionState | undefined) {
  if (connector.auth === "external" && connection?.status === "unknown") return "Not set up";
  return connector.optional ? "Optional" : "Not connected";
}

function ManageLink({ connector, children, variant = "ghost" }: {
  connector: Connector;
  children: string;
  variant?: "ghost" | "secondary" | "primary";
}) {
  return (
    <a
      href={macridAppLink(connector.manageHref ?? "/")}
      target="_blank"
      rel="noreferrer"
      className={buttonStyles({ variant: variant === "primary" ? undefined : variant, size: "sm" })}
    >
      {children}
      <ExternalLink className="size-3.5" />
    </a>
  );
}

export function ConnectorCard({ connector, connection, loading, busy, onConnect, onDisconnect }: ConnectorCardProps) {
  const { Icon } = connector;
  const connected = connection?.status === "connected";
  // Mailboxes and SMS senders can be several; add more here, remove them in Dexisphere.
  const multiple = connector.store === "mail_accounts" || connector.store === "sms_senders";

  const action = connected ? (
    multiple ? (
      <>
        <Button variant="secondary" size="sm" onClick={() => onConnect(connector)}>
          Add another
        </Button>
        <ManageLink connector={connector}>Manage</ManageLink>
      </>
    ) : connector.auth === "external" ? (
      <ManageLink connector={connector} variant="secondary">
        Manage in Dexisphere
      </ManageLink>
    ) : (
      <Button variant="secondary" size="sm" onClick={() => onDisconnect(connector)}>
        Disconnect
      </Button>
    )
  ) : connector.auth === "external" ? (
    <ManageLink connector={connector} variant="primary">
      Set up in Dexisphere
    </ManageLink>
  ) : (
    <Button size="sm" loading={busy} onClick={() => onConnect(connector)}>
      {multiple ? "Add sender" : connector.auth === "api_key" ? "Add key" : "Connect"}
    </Button>
  );

  return (
    <article className="group flex h-full flex-col gap-4 rounded-3xl border border-line bg-raised/40 p-6 backdrop-blur transition-[background-color,box-shadow] duration-200 hover:bg-raised/80 hover:shadow-float">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface text-ink ring-1 ring-inset ring-line">
          <Icon className="size-5" />
        </span>
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
        {loading ? <Skeleton className="h-8 w-24 rounded-lg" /> : action}
      </div>
    </article>
  );
}
