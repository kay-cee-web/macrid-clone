"use client";

import { useConnectorFlows } from "@/components/plugins/ConnectorFlows";
import { Button } from "@/components/ui/Button";
import { CONNECTORS_BY_KEY } from "@/data/connectors";
import { AD_PLATFORMS } from "@/data/connectors/social";
import type { AdAccountOverview } from "@/types/ads";
import { FailureReason } from "./FailureReason";

/**
 * An ad account the backend couldn't read: its reason, and Reconnect, which
 * starts the sign-in it came with (Meta Ads → the Facebook Page grant).
 * Needs a `WorkspaceConnectorFlows` above it for the button.
 */
export function AdAccountProblem({ account }: { account: AdAccountOverview }) {
  const flows = useConnectorFlows();
  const via = CONNECTORS_BY_KEY[AD_PLATFORMS[account.platform]?.via ?? ""];

  return (
    <span className="relative z-10 inline-flex flex-wrap items-center gap-1">
      <FailureReason status="failed" reason={account.error} title={account.name || "Ad account"} />
      {flows && via && (
        <Button size="sm" variant="secondary" className="h-6 px-2 text-xs" loading={flows.pending === via.key} onClick={() => flows.connect(via)}>
          Reconnect
        </Button>
      )}
    </span>
  );
}
