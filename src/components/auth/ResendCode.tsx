"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatClock, useCountdown } from "@/hooks/useCountdown";
import { extractApiError } from "@/lib/api/errors";

const COOLDOWN_SECONDS = 60;

/** "Didn't get it? Send a new code", with a cooldown after each send. */
export function ResendCode({
  send,
  startCoolingDown = false,
}: {
  send: () => Promise<unknown>;
  startCoolingDown?: boolean;
}) {
  const { remaining, done, restart } = useCountdown(startCoolingDown ? COOLDOWN_SECONDS : 0);
  const [sending, setSending] = useState(false);

  async function onClick() {
    setSending(true);
    try {
      await send();
      toast.success("New code sent. Check your inbox.");
      restart(COOLDOWN_SECONDS);
    } catch (err) {
      toast.error(extractApiError(err, "Could not send a new code"));
    } finally {
      setSending(false);
    }
  }

  return (
    <p className="text-center text-[13.5px] text-muted">
      Didn&apos;t get it?{" "}
      {done ? (
        <button
          type="button"
          onClick={onClick}
          disabled={sending}
          className="font-medium text-accent hover:underline disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send a new code"}
        </button>
      ) : (
        <span>
          Send a new code in <span className="font-mono tabular-nums">{formatClock(remaining)}</span>
        </span>
      )}
    </p>
  );
}
