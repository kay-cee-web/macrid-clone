"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { extractApiError } from "@/lib/api/errors";
import { fetchMeetings } from "@/services/meetings";
import type { Meeting, MeetingAllowance } from "@/types/meeting";

type Data = { meetings: Meeting[]; allowance: MeetingAllowance };

const TEN_MINUTES = 10 * 60_000;

/**
 * How long until we look again, or 0 to stop.
 *
 * A meeting moves through its states on the vendor's side — the bot joins, the
 * call runs, the transcript arrives on a webhook — so nothing tells the browser
 * when to re-read. Without this the row a user just created sits on "Scheduled"
 * until they think to refresh, which reads as broken.
 *
 * Polling is scoped to what's actually happening rather than run on a blanket
 * timer: a call in progress is worth 10s, one starting within the next ten
 * minutes is worth 30s, and a bot booked for tomorrow is worth nothing at all.
 */
export function nextPollDelay(meetings: Meeting[], now = Date.now()): number {
  let delay = 0;
  for (const meeting of meetings) {
    if (meeting.status === "recording" || meeting.status === "joining") return 10_000;
    if (meeting.status !== "scheduled") continue;
    // No start time means "join as soon as it starts", which could be any moment.
    const at = meeting.startsAt ? new Date(meeting.startsAt).getTime() : now;
    if (Number.isNaN(at) || at - now <= TEN_MINUTES) delay = 30_000;
  }
  return delay;
}

/** The meetings list, kept current while a call is live. */
export function useMeetings() {
  const [data, setData] = useState<Data | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const alive = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latest = useRef<Data | null>(null);

  const read = useCallback(async (manual: boolean) => {
    if (manual) setRefreshing(true);
    try {
      const next = await fetchMeetings();
      if (alive.current) {
        latest.current = next;
        setData(next);
        setStatus("ready");
        setError(null);
      }
      return next;
    } catch (err) {
      // A failed poll must never blank a view that is already working; only the
      // first read can put the screen into its error state.
      if (alive.current) {
        setError(extractApiError(err, "Could not load your meetings"));
        setStatus((was) => (was === "ready" ? was : "error"));
      }
      return latest.current;
    } finally {
      if (alive.current && manual) setRefreshing(false);
    }
  }, []);

  // One scheduler, shared by the timer and the Refresh button, so a manual read
  // re-arms the timer from what it just saw instead of running a second loop.
  const tick = useRef<(manual: boolean) => void>(() => {});

  useEffect(() => {
    alive.current = true;

    const run = async (manual: boolean) => {
      // A tab nobody is looking at shouldn't poll; it picks up when they return.
      const idle = !manual && typeof document !== "undefined" && document.hidden;
      const next = idle ? latest.current : await read(manual);
      if (!alive.current) return;
      clearTimeout(timer.current);
      const delay = nextPollDelay(next?.meetings ?? []);
      if (delay) timer.current = setTimeout(() => void run(false), delay);
    };

    tick.current = (manual) => void run(manual);
    void run(false);
    return () => {
      alive.current = false;
      clearTimeout(timer.current);
    };
  }, [read]);

  const reload = useCallback(() => tick.current(true), []);

  return { data, status, error, refreshing, reload };
}
