"use client";

import { Button } from "@/components/ui/Button";
import { modeOf } from "@/data/connectors/workTools";
import type { Connector } from "@/types/connector";
import { useConnectorFlows } from "./ConnectorFlows";

/**
 * A connected work tool. A watcher offers "Check now" — the same look as
 * `check_work_tool` in chat, which deliberately doesn't move the cursor, so
 * asking what's on your plate never silences the background watcher for items
 * you haven't dealt with. A speak connector has nothing to check; it posts when
 * an agent tells it to.
 */
export function WorkToolActions({ connector }: { connector: Connector }) {
  const flows = useConnectorFlows();
  if (!flows) return null;
  const broken = flows.connections?.state[connector.key]?.status === "attention";
  const watching = modeOf(connector.key) === "watch";

  return (
    <>
      {broken ? (
        <Button size="sm" loading={flows.pending === connector.key} onClick={() => flows.connect(connector)}>
          Reconnect
        </Button>
      ) : (
        watching && (
          <Button variant="secondary" size="sm" loading={flows.pending === connector.key} onClick={() => flows.check(connector)}>
            Check now
          </Button>
        )
      )}
      <Button variant={broken ? "ghost" : "secondary"} size="sm" onClick={() => flows.disconnect(connector)}>
        Disconnect
      </Button>
    </>
  );
}
