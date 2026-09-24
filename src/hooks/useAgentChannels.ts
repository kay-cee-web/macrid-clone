"use client";

import { MESSAGING_CONNECTORS } from "@/data/connectors/messaging";
import { fetchChannelStatus } from "@/services/channels";
import type { ConnectionState } from "@/types/connector";
import { useAsync } from "./useAsync";

/**
 * The open agent's chat channels as connector states, keyed like the Messaging
 * cards. `fetchChannelStatus` never throws, so a failed read shows as not connected.
 */
export function useAgentChannels(agentId: string): Record<string, ConnectionState> | null {
  const read = useAsync(
    () =>
      Promise.all(
        MESSAGING_CONNECTORS.map(async (connector): Promise<[string, ConnectionState]> => {
          const status = await fetchChannelStatus(agentId, connector.channel!);
          const labels = status.links.map((link) => link.label).filter(Boolean);
          return [connector.key, { status: status.connected ? "connected" : "disconnected", recordId: null, detail: labels.join(", ") }];
        }),
      ).then(Object.fromEntries),
    [agentId],
  );
  return read.data;
}
