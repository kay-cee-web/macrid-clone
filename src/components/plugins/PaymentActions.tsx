"use client";

import { Button } from "@/components/ui/Button";
import type { Connector } from "@/types/connector";
import { useConnectorFlows } from "./ConnectorFlows";

/**
 * A connected payment account: Alerts (the webhook and what to hear about),
 * Test (try the key again) and Disconnect. Alerts leads when something needs
 * attention, since a missing webhook secret is the usual cause.
 */
export function PaymentActions({ connector }: { connector: Connector }) {
  const flows = useConnectorFlows();
  if (!flows) return null;
  const broken = flows.connections?.state[connector.key]?.status === "attention";

  return (
    <>
      <Button variant={broken ? undefined : "secondary"} size="sm" onClick={() => flows.alerts(connector)}>
        Alerts
      </Button>
      <Button variant="ghost" size="sm" loading={flows.pending === connector.key} onClick={() => flows.test(connector)}>
        Test
      </Button>
      <Button variant="ghost" size="sm" onClick={() => flows.disconnect(connector)}>
        Disconnect
      </Button>
    </>
  );
}
