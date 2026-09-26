"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buttonStyles } from "@/components/ui/button-styles";
import { macridAppLink } from "@/lib/config";
import type { Connector } from "@/types/connector";
import { useConnectorFlows } from "./ConnectorFlows";
import { EmailPlatformActions } from "./EmailPlatformActions";
import { PaymentActions } from "./PaymentActions";

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


/**
 * A connector's buttons, the same on its Plugins card and in an idea card's
 * logo popover: Connect (Add key, Add sender) while it's off, Reconnect when it
 * needs attention, Disconnect once it's on. WhatsApp Business and Facebook are
 * set up in the Macrid app, so they link there; an agent's chat channels pair
 * in its settings. `compact` (the popover) leaves out a sender's extras.
 */
export function ConnectorActions({ connector, compact = false }: { connector: Connector; compact?: boolean }) {
  const flows = useConnectorFlows();
  // Until the status is known, offer nothing: a second "Add key" would POST a duplicate row.
  if (!flows?.connections) return null;

  const status = flows.connections.state[connector.key]?.status;
  const connected = status === "connected";
  const broken = status === "attention";
  // Senders and mailboxes can be several: add more here. Senders are fine-tuned in
  // Dexisphere; mailboxes are managed here, since only this app reads them.
  const mailboxes = connector.store === "mailboxes";
  const multiple = mailboxes || connector.store === "mail_accounts" || connector.store === "sms_senders";

  if (connector.auth === "channel") {
    if (!flows.agentId || !connector.channel) return null;
    return (
      <Link
        href={`/agents/${flows.agentId}/settings?section=channels&channel=${connector.channel}`}
        className={buttonStyles({ variant: connected ? "secondary" : undefined, size: "sm" })}
      >
        {connected ? "Manage" : "Connect"}
      </Link>
    );
  }

  if (connector.auth === "external") {
    return connected ? (
      <ManageLink connector={connector} variant="secondary">Manage in Dexisphere</ManageLink>
    ) : (
      <ManageLink connector={connector} variant="primary">Connect</ManageLink>
    );
  }

  if (connected || broken) {
    if (connector.store === "payments") return <PaymentActions connector={connector} />;
    // "Needs attention" here usually means no list chosen yet, not a broken key,
    // so it offers the picker rather than Reconnect.
    if (connector.store === "email_platforms") return <EmailPlatformActions connector={connector} />;
  }

  if (!connected && !broken) {
    return (
      <Button size="sm" loading={flows.pending === connector.key} onClick={() => flows.connect(connector)}>
        {mailboxes ? "Add mailbox" : multiple ? "Add sender" : connector.auth === "api_key" && connector.store !== "payments" ? "Add key" : "Connect"}
      </Button>
    );
  }

  return (
    <>
      {broken &&
        (mailboxes ? (
          <Button size="sm" onClick={flows.manageMailboxes}>Fix mailbox</Button>
        ) : (
          <Button size="sm" loading={flows.pending === connector.key} onClick={() => flows.connect(connector)}>
            Reconnect
          </Button>
        ))}
      <Button variant={broken ? "ghost" : "secondary"} size="sm" onClick={() => flows.disconnect(connector)}>
        Disconnect
      </Button>
      {multiple && !compact && connected && (
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
