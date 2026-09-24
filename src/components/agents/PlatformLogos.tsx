"use client";

import { ConnectorActions } from "@/components/plugins/ConnectorActions";
import { useConnectorFlows } from "@/components/plugins/ConnectorFlows";
import { ConnectorLogo } from "@/components/plugins/ConnectorLogo";
import { Popover } from "@/components/ui/Popover";
import { cn } from "@/lib/cn";
import { SETUP_LABEL, type PlatformConnector } from "@/lib/setup/connectorsFor";
import type { SetupState } from "@/lib/setup/platforms";

const DOT: Record<SetupState, string> = {
  ready: "bg-good",
  shared: "bg-teal",
  missing: "bg-warn",
  attention: "bg-bad",
  unknown: "bg-faint",
  planned: "bg-faint",
};

/** Name, status and the one action that fits: Connect, Disconnect, set up in Dexisphere, or coming soon. */
function ConnectorPanel({ connector, state }: PlatformConnector) {
  const flows = useConnectorFlows();
  const detail = state === "ready" || state === "attention" ? flows?.connections?.state[connector.key]?.detail : "";
  return (
    <div className="grid w-64 gap-3 p-3">
      <div className="flex items-center gap-2.5">
        <ConnectorLogo connector={connector} className="size-8" />
        <div className="grid min-w-0">
          <span className="truncate font-medium">{connector.name}</span>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            {state && <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", DOT[state])} />}
            {state ? SETUP_LABEL[state] : "Checking…"}
          </span>
        </div>
      </div>
      {detail && <p className="truncate font-mono text-xs text-faint">{detail}</p>}
      <div className="flex flex-wrap items-center gap-2 empty:hidden">
        <ConnectorActions connector={connector} compact />
      </div>
    </div>
  );
}

/**
 * The connectors a task uses, as their logos. Each one opens a popover (on
 * hover, or a tap) to connect or disconnect it right there. The row sits above
 * the card's stretched button (`z-10`), and the popovers open leftwards
 * because it's on the card's right edge.
 */
export function PlatformLogos({ items, className }: { items: PlatformConnector[]; className?: string }) {
  if (!items.length) return null;
  return (
    <div className={cn("relative z-10 flex shrink-0 items-center gap-1.5", className)}>
      {items.map(({ connector, state }) => (
        <Popover
          key={connector.key}
          align="end"
          label={connector.name}
          trigger={(props) => (
            <button
              type="button"
              {...props}
              aria-label={state ? `${connector.name}: ${SETUP_LABEL[state]}` : connector.name}
              className="rounded-md transition-transform hover:-translate-y-px"
            >
              <ConnectorLogo connector={connector} className="size-6 rounded-md" />
            </button>
          )}
        >
          <ConnectorPanel connector={connector} state={state} />
        </Popover>
      ))}
    </div>
  );
}
