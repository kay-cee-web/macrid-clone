"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { extractApiError } from "@/lib/api/errors";
import { fetchOAuthUrl } from "@/services/connections";
import type { Connector } from "@/types/connector";

/**
 * The source the backend's callback page posts when consent finishes —
 * confirmed by reading the live `/connectors/google/callback` page, which sends
 * `{source: "dexisphere-connector", ok, message}`. The Macrid spelling is kept
 * only because the rename may not have reached every route; drop it once it has.
 *
 * Getting this wrong fails quietly rather than loudly: the message is ignored,
 * the popup-closed poll settles the flow as `ok: false`, and the connection
 * still refreshes — so the card updates but neither the success line nor the
 * backend's reason is ever shown.
 */
const MESSAGE_SOURCES = ["dexisphere-connector", "macrid-connector"];
const WIDTH = 560;
const HEIGHT = 680;

type Flight = { key: string; popup: Window; timer?: ReturnType<typeof setInterval> } | null;

/**
 * Consent in a popup. The window opens on the click (before any await) so
 * blockers allow it, then points at the sign-in link once it arrives.
 * Finishes on the callback's postMessage or when the user closes the popup.
 */
export function useOAuthPopup(onFinished: (result: { key: string; ok: boolean; message?: string }) => void) {
  const [pending, setPending] = useState<string | null>(null);
  const flight = useRef<Flight>(null);
  const finished = useRef(onFinished);

  useEffect(() => {
    finished.current = onFinished;
  }, [onFinished]);

  const settle = useCallback((ok: boolean, message?: string) => {
    const run = flight.current;
    if (!run) return;
    if (run.timer) clearInterval(run.timer);
    flight.current = null;
    setPending(null);
    finished.current({ key: run.key, ok, message });
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (MESSAGE_SOURCES.includes(event.data?.source)) settle(event.data.ok === true, event.data.message);
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      if (flight.current?.timer) clearInterval(flight.current.timer);
    };
  }, [settle]);

  const connect = useCallback(
    async (connector: Connector) => {
      if (flight.current) return;
      const left = Math.max(0, (window.screen.width - WIDTH) / 2);
      const top = Math.max(0, (window.screen.height - HEIGHT) / 2);
      const popup = window.open("", "macrid-connector", `width=${WIDTH},height=${HEIGHT},left=${left},top=${top}`);
      if (!popup) return void toast.error("Allow pop-ups for this site, then try again.");

      flight.current = { key: connector.key, popup };
      setPending(connector.key);
      try {
        const url = await fetchOAuthUrl(connector);
        if (popup.closed) return settle(false);
        popup.location.href = url;
        const run = flight.current;
        if (run) run.timer = setInterval(() => run.popup.closed && settle(false), 800);
      } catch (err) {
        popup.close();
        toast.error(extractApiError(err, `Could not start ${connector.name}`));
        settle(false);
      }
    },
    [settle],
  );

  return { connect, pending };
}
