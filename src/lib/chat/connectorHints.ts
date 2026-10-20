import { connectorsFor, type PlatformConnector } from "@/lib/setup/connectorsFor";
import { missingIn, platformsMentioned, type WorkspaceSetup } from "@/lib/setup/platforms";
import type { ThreadMessage } from "./conversation";

/**
 * The connectors to offer under each reply: the platforms its turn (the user's
 * message and the reply) names that aren't connected. Each connector is offered
 * once, under the latest turn that names it, so a long thread doesn't repeat the
 * card. Nothing until the workspace has been read, since every one would look missing.
 */
export function connectorHints(messages: ThreadMessage[], setup: WorkspaceSetup | null) {
  const hints = new Map<string, PlatformConnector[]>();
  if (!setup) return hints;
  const offered = new Set<string>();

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const reply = messages[i];
    if (reply.role !== "assistant" || reply.error) continue;
    const asked = messages[i - 1]?.role === "user" ? messages[i - 1].text : "";
    const missing = missingIn(setup, platformsMentioned(`${asked}\n${reply.text}`));
    const fresh = connectorsFor(missing, setup).filter(({ connector }) => !offered.has(connector.key));
    fresh.forEach(({ connector }) => offered.add(connector.key));
    if (fresh.length) hints.set(reply.id, fresh);
  }
  return hints;
}
