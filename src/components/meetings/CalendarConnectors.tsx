"use client";

import { Rows } from "@/components/app/SettingsPanels";
import { ConnectorActions } from "@/components/plugins/ConnectorActions";
import { ConnectorLogo } from "@/components/plugins/ConnectorLogo";
import { useConnectorFlows } from "@/components/plugins/ConnectorFlows";
import { Skeleton } from "@/components/ui/Skeleton";
import { CONNECTORS_BY_KEY } from "@/data/connectors";
import type { ConnectionState } from "@/types/connector";

/**
 * The two calendars a notetaker can be pointed at.
 *
 * They sit at the top because without one, "cover my upcoming meetings" has
 * nothing to read. One bordered card of hairline rows, the shape settings uses,
 * so it reads as a single prerequisite rather than two floating boxes — and
 * each row says its own status, which is what fills the space between the name
 * and the button.
 *
 * The buttons are `ConnectorActions`, so connecting here is the same flow as on
 * Plugins and the state refreshes everywhere at once. Needs a
 * `WorkspaceConnectorFlows` above it, which `MeetingsView` mounts.
 */
const CALENDAR_KEYS = ["calendar", "outlook_mail"];

function statusLine(connection: ConnectionState | undefined): string {
  if (connection?.status === "attention") return connection.detail || "Needs attention";
  if (connection?.status === "connected") return connection.detail || "Connected";
  return "Not connected";
}

export function CalendarConnectors() {
  const flows = useConnectorFlows();
  const connections = flows?.connections;

  return (
    <Rows>
      {CALENDAR_KEYS.map((key) => {
        const connector = CONNECTORS_BY_KEY[key];
        if (!connector) return null;
        const connection = connections?.state[key];
        return (
          <div key={key} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <ConnectorLogo connector={connector} className="size-9 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{connector.name}</p>
              {connections ? (
                <p className="truncate text-xs text-muted">{statusLine(connection)}</p>
              ) : (
                <Skeleton className="mt-1 h-3 w-24" />
              )}
            </div>
            <ConnectorActions connector={connector} compact />
          </div>
        );
      })}
    </Rows>
  );
}
