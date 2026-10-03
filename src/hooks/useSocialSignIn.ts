"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { USEREND_URL } from "@/lib/api/config";
import { extractApiError } from "@/lib/api/errors";
import { openCenteredPopup } from "@/lib/ui/popup";
import { fetchSocialAuthUrl, type SocialProvider } from "@/services/auth";
import { useAuth } from "./useAuth";

/**
 * The callback page's postMessage, read off the live page (2026-10-03):
 * `{source: "dexisphere-auth", ok, token, new, message}`, sent from the API's
 * origin. It targets the backend's FRONTEND_URL only, so from any other origin
 * (localhost included) the browser drops it and the popup just closes.
 */
const SOURCE = "dexisphere-auth";
const CALLBACK_TARGET = "https://app.dexisphere.com";
/** Long enough to read and screenshot a failure for the backend team. */
const ERROR_TOAST = { duration: 15000 };
const API_ORIGIN = (() => {
  try {
    return new URL(USEREND_URL).origin;
  } catch {
    return "";
  }
})();

type Flight = { popup: Window; timer?: ReturnType<typeof setInterval> } | null;

/**
 * Google or Facebook sign-in in a popup. One flow signs in and signs up; on
 * success the token goes to `signIn`, and AuthGate does the redirect.
 */
export function useSocialSignIn() {
  const { signIn } = useAuth();
  const [pending, setPending] = useState<SocialProvider | null>(null);
  const flight = useRef<Flight>(null);

  const finish = useCallback(() => {
    if (flight.current?.timer) clearInterval(flight.current.timer);
    flight.current = null;
  }, []);

  // Closed with no message: backed out, or the reply went to another origin.
  const closedSilently = useCallback(() => {
    finish();
    setPending(null);
    const elsewhere = window.location.origin !== CALLBACK_TARGET;
    toast.error("The sign-in window closed without sending a result back.", {
      ...ERROR_TOAST,
      description: elsewhere
        ? `This page is ${window.location.origin}; the backend only sends sign-in results to ${CALLBACK_TARGET}.`
        : "If you didn't close it yourself, try again.",
    });
  }, [finish]);

  useEffect(() => {
    const onMessage = async (event: MessageEvent) => {
      if (event.origin !== API_ORIGIN || event.data?.source !== SOURCE) return;
      finish();
      const { ok, token, message, ...rest } = event.data;
      if (!ok || typeof token !== "string" || !token) {
        setPending(null);
        console.warn("Social sign-in failed", { ok, message, hasToken: Boolean(token), ...rest });
        const reason = ok ? "Sign-in succeeded but no token came back." : message || "Sign-in didn't finish.";
        return void toast.error(reason, ERROR_TOAST);
      }
      if (event.data.new) toast.success("Account created. Welcome to Dexisphere.");
      try {
        await signIn(token);
      } catch (err) {
        toast.error(extractApiError(err, "Signed in, but your account couldn't be loaded"), ERROR_TOAST);
      }
      setPending(null);
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      finish();
    };
  }, [signIn, finish]);

  const start = useCallback(
    async (provider: SocialProvider) => {
      if (flight.current) return;
      const popup = openCenteredPopup("dexisphere-auth");
      if (!popup) return void toast.error("Allow pop-ups for this site, then try again.");

      flight.current = { popup };
      setPending(provider);
      try {
        const url = await fetchSocialAuthUrl(provider);
        if (popup.closed) return void (finish(), setPending(null));
        popup.location.href = url;
        const run = flight.current;
        if (run) run.timer = setInterval(() => run.popup.closed && closedSilently(), 800);
      } catch (err) {
        popup.close();
        finish();
        setPending(null);
        toast.error(extractApiError(err, `Could not start ${provider} sign-in`), ERROR_TOAST);
      }
    },
    [finish, closedSilently],
  );

  return { start, pending };
}
