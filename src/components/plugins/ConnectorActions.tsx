"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buttonStyles } from "@/components/ui/button-styles";
import { workflowsNeeding } from "@/data/ideas";
import { macridAppLink } from "@/lib/config";
import type { Connector } from "@/types/connector";
import { useConnectorFlows } from "./ConnectorFlows";

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

/** Where a planned connector's button would be: how many workflows are waiting on it. */
function WaitingNote({ connector }: { connector: Connector }) {
  const waiting = workflowsNeeding(connector.key);
  return (
    <span className="text-sm text-faint">
      {waiting ? `${waiting} workflow${waiting === 1 ? " is" : "s are"} waiting on it` : "Not built yet"}
    </span>
  );
}

/**
 * A connector's buttons, the same on its Plugins card and in an idea card's
 * logo popover: Connect (Add key, Add sender) while it's off, Disconnect once
 * it's on. WhatsApp Business and Facebook are set up in the Macrid app, so
 * they link there. `compact` (the popover) leaves out a sender's extras.
 */
export function ConnectorActions({ connector, compact = false }: { connector: Connector; compact?: boolean }) {
  const flows = useConnectorFlows();
  if (connector.auth === "planned") return <WaitingNote connector={connector} />;
  // Until the status is known, offer nothing: a second "Add key" would POST a duplicate row.
  if (!flows?.connections) return null;

  const connected = flows.connections?.state[connector.key]?.status === "connected";
  // Senders and mailboxes can be several: add more here. Senders are fine-tuned in
  // Dexisphere; mailboxes are managed here, since only this app reads them.
  const mailboxes = connector.store === "mailboxes";
  const multiple = mailboxes || connector.store === "mail_accounts" || connector.store === "sms_senders";

  if (connector.auth === "external") {
    return connected ? (
      <ManageLink connector={connector} variant="secondary">Manage in Dexisphere</ManageLink>
    ) : (
      <ManageLink connector={connector} variant="primary">Connect</ManageLink>
    );
  }

  if (!connected) {
    return (
      <Button size="sm" loading={flows.pending === connector.key} onClick={() => flows.connect(connector)}>
        {mailboxes ? "Add mailbox" : multiple ? "Add sender" : connector.auth === "api_key" ? "Add key" : "Connect"}
      </Button>
    );
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => flows.disconnect(connector)}>
        Disconnect
      </Button>
      {multiple && !compact && (
        <>
          <Button variant="ghost" size="sm" onClick={() => flows.connect(connector)}>
            Add another
          </Button>
          {mailboxes ? (
            <Button variant="ghost" size="sm" onClick={flows.manageMailboxes}>Manage</Button>
          ) : (
            <ManageLink connector={connector}>Manage</ManageLink>
          )}
        </>
      )}
    </>
  );
}
