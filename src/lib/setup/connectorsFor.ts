import { CONNECTORS_BY_KEY } from "@/data/connectors";
import { PLATFORMS, type PlatformId } from "@/data/platforms";
import type { Connector } from "@/types/connector";
import type { SetupState, WorkspaceSetup } from "./platforms";

/** `state` is null until the workspace has been read, except for connectors nobody has built. */
export type PlatformConnector = { connector: Connector; state: SetupState | null };

/** What a connector's logo says on hover. */
export const SETUP_LABEL: Record<SetupState, string> = {
  ready: "Connected",
  shared: "Not connected · using the shared one",
  missing: "Not connected",
  attention: "Needs attention",
  unknown: "Status can't be checked here",
  planned: "Work in progress",
};

/**
 * The connector standing for each platform an idea touches, as `setupFrom`
 * picked it. Two platforms served by one connector (Outlook for mail and
 * calendar) show it once.
 */
export function connectorsFor(platforms: PlatformId[], setup: WorkspaceSetup | null): PlatformConnector[] {
  const seen = new Set<string>();
  const out: PlatformConnector[] = [];
  for (const id of platforms) {
    const key = setup?.[id].connector ?? PLATFORMS[id].connectors[0];
    const connector = CONNECTORS_BY_KEY[key];
    if (!connector || seen.has(key)) continue;
    seen.add(key);
    out.push({ connector, state: setup?.[id].state ?? (connector.auth === "planned" ? "planned" : null) });
  }
  return out;
}
