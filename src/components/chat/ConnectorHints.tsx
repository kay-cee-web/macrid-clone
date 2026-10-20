"use client";

import { useState } from "react";
import Link from "next/link";
import { Blocks, X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { ConnectorActions } from "@/components/plugins/ConnectorActions";
import { ConnectorLogo } from "@/components/plugins/ConnectorLogo";
import { cn } from "@/lib/cn";
import type { PlatformConnector } from "@/lib/setup/connectorsFor";

type ConnectorHintsProps = {
  hints: PlatformConnector[];
  agentId: string;
  className?: string;
};

/**
 * Under a reply: the services its turn named that aren't connected, each with
 * the same buttons as its Plugins card. Connecting one drops it from the list
 * (the setup store is read again); closing hides the card for this visit.
 */
export function ConnectorHints({ hints, agentId, className }: ConnectorHintsProps) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <section aria-label="Connectors that could help" className={cn("grid rounded-xl border border-line bg-surface", className)}>
      <header className="flex items-center gap-2 border-b border-line py-1.5 pl-3.5 pr-1.5">
        <span className="min-w-0 flex-1 text-xs font-medium text-ink">Connectors that could help</span>
        <Link
          href={`/agents/${agentId}/plugins?tab=connectors`}
          title="All connectors"
          aria-label="All connectors"
          className="grid size-7 place-items-center rounded-md text-muted hover:bg-raised hover:text-ink"
        >
          <Blocks className="size-3.5" />
        </Link>
        <IconButton size="sm" label="Hide" onClick={() => setHidden(true)}>
          <X />
        </IconButton>
      </header>
      <ul className="grid divide-y divide-line">
        {hints.map(({ connector }) => (
          <li key={connector.key} className="flex flex-wrap items-center gap-3 px-3.5 py-2.5">
            <ConnectorLogo connector={connector} className="size-8" />
            <div className="grid min-w-0 flex-1">
              <span className="truncate text-sm font-medium text-ink">{connector.name}</span>
              <span className="truncate text-xs text-muted">{connector.description}</span>
            </div>
            <div className="flex shrink-0 gap-2">
              <ConnectorActions connector={connector} compact />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
