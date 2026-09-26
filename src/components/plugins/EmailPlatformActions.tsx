"use client";

import { Button } from "@/components/ui/Button";
import { LISTLESS, listWordFor } from "@/data/connectors/emailPlatforms";
import type { Connector } from "@/types/connector";
import { useConnectorFlows } from "./ConnectorFlows";

/**
 * A connected email platform: which list it syncs with, and Disconnect. The
 * syncing itself is the agent's job ("import my Mailchimp audience"), so there
 * are no import and export buttons here. Systeme.io groups by tag and has no
 * list to pick, so it shows Disconnect alone.
 */
export function EmailPlatformActions({ connector }: { connector: Connector }) {
  const flows = useConnectorFlows();
  if (!flows) return null;
  const needsList = flows.connections?.state[connector.key]?.status === "attention";
  const word = listWordFor(connector.key);

  return (
    <>
      {!LISTLESS.includes(connector.key) && (
        <Button variant={needsList ? undefined : "secondary"} size="sm" onClick={() => flows.chooseList(connector)}>
          {needsList ? `Choose ${word}` : `Change ${word}`}
        </Button>
      )}
      <Button variant="ghost" size="sm" onClick={() => flows.disconnect(connector)}>
        Disconnect
      </Button>
    </>
  );
}
