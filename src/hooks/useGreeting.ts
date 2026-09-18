"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { firstName } from "@/lib/format";
import { dayPartOf, headlineFor, type DayPart } from "@/lib/greeting";

/** Long enough to catch a part change, short enough that nothing else notices. */
const TICK_MS = 60_000;

/** The current part of the day, once the client's clock is known (null on the server). */
export function useDayPart(): DayPart | null {
  const [part, setPart] = useState<DayPart | null>(null);

  useEffect(() => {
    const read = () => setPart(dayPartOf());
    read();
    const id = window.setInterval(read, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  return part;
}

/**
 * Home's headline: neutral on the server, then the time-of-day line after
 * mount, and it moves on by itself when the hour rolls over.
 */
export function useGreeting(): string {
  const { user } = useAuth();
  const part = useDayPart();
  // One pick per mount, so the wording doesn't reshuffle on every render.
  const [seed] = useState(Math.random);
  return headlineFor(part, firstName(user?.name), seed);
}
