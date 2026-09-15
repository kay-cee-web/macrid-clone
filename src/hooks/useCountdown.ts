"use client";

import { useCallback, useEffect, useState } from "react";

/** Seconds remaining until a deadline; `restart(seconds)` sets a new one. */
export function useCountdown(initialSeconds = 0) {
  const [deadline, setDeadline] = useState(() =>
    initialSeconds > 0 ? Date.now() + initialSeconds * 1000 : 0,
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!deadline) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const restart = useCallback((seconds: number) => {
    const start = Date.now();
    setNow(start);
    setDeadline(start + seconds * 1000);
  }, []);

  const remaining = deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : 0;
  return { remaining, done: remaining === 0, restart };
}

/** 900 → "15:00" */
export const formatClock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
