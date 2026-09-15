"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { extractApiError } from "@/lib/api/errors";
import { disconnectChannel, fetchChannelStatus, startChannelConnect } from "@/services/channels";
import type { ChannelLink, ChannelProvider, Pairing } from "@/types/channel";

/** Poll quickly right after a code is issued, then back off. */
const pollDelay = (elapsedMs: number) => (elapsedMs < 30_000 ? 2_000 : elapsedMs < 120_000 ? 5_000 : 10_000);

type State = { checking: boolean; connected: boolean; links: ChannelLink[] };

/**
 * A pairing completes on the provider's side (webhook), so the only way to
 * learn it worked is to ask `status` on a timer while a code is live.
 */
export function useChannelConnection(agentId: string, provider: ChannelProvider, name: string) {
  const [state, setState] = useState<State>({ checking: true, connected: false, links: [] });
  const [pairing, setPairing] = useState<Pairing | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const status = await fetchChannelStatus(agentId, provider);
    setState({ checking: false, ...status });
    return status;
  }, [agentId, provider]);

  useEffect(() => {
    let cancelled = false;
    fetchChannelStatus(agentId, provider).then((status) => {
      if (!cancelled) setState({ checking: false, ...status });
    });
    return () => {
      cancelled = true;
    };
  }, [agentId, provider]);

  // While a code is live, watch for the link to land.
  useEffect(() => {
    if (!pairing) return;
    const startedAt = Date.now();
    const baseline = state.links.map((link) => link.id).join(",");
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;
    // Re-pairing briefly turns the live row "pending", so wait for the set of links to change at least once.
    let changed = false;

    const tick = async () => {
      if (cancelled || Date.now() > pairing.expiresAt) return;
      const status = await fetchChannelStatus(agentId, provider);
      if (cancelled) return;
      if (status.links.map((link) => link.id).join(",") !== baseline) changed = true;
      // Only ever promote: a blip never flips a linked channel back.
      if (status.connected && changed) {
        setState({ checking: false, ...status });
        setPairing(null);
        toast.success(`${name} is linked. Your agent will answer there.`);
        return;
      }
      timer = setTimeout(tick, pollDelay(Date.now() - startedAt));
    };
    timer = setTimeout(tick, pollDelay(0));
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // Baseline is captured when the code is issued, on purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairing, agentId, provider, name]);

  const start = useCallback(async () => {
    setConnecting(true);
    try {
      setPairing(await startChannelConnect(agentId, provider));
    } catch (err) {
      toast.error(extractApiError(err, `Could not start the ${name} connection`));
    } finally {
      setConnecting(false);
    }
  }, [agentId, provider, name]);

  const disconnect = useCallback(
    async (link: ChannelLink) => {
      setDisconnectingId(link.id);
      try {
        const message = await disconnectChannel(agentId, provider, link.id);
        toast.success(message || `${name} disconnected.`);
      } catch (err) {
        toast.error(extractApiError(err, `Could not disconnect ${name}`));
      } finally {
        await refresh();
        setDisconnectingId(null);
      }
    },
    [agentId, provider, name, refresh],
  );

  return { ...state, pairing, connecting, disconnectingId, start, disconnect, cancel: () => setPairing(null) };
}
