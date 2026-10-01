"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

/**
 * Debounced save, driven from change handlers rather than from an effect — a
 * keystroke schedules work, a render never does.
 *
 * Two things it has to get right. It never runs two saves at once, because the
 * first save of a new note is the call that creates it and a second one in
 * flight would create a duplicate. And it flushes on unmount, so navigating
 * away a second after typing saves the note instead of dropping it.
 */
export function useAutosave<T>(save: (value: T) => Promise<unknown>, delay = 1200) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<{ value: T } | null>(null);
  const busy = useRef(false);
  const saveRef = useRef(save);

  // Held in a ref, not a dependency: the caller rebuilds `save` on every
  // keystroke and the running timer must call the newest one without restarting.
  useEffect(() => {
    saveRef.current = save;
  });

  const run = async () => {
    if (!pending.current || busy.current) return;
    const { value } = pending.current;
    pending.current = null;
    busy.current = true;
    setStatus("saving");
    try {
      await saveRef.current(value);
      setStatus("saved");
    } catch {
      setStatus("error");
    } finally {
      busy.current = false;
      // A change that landed mid-save left its own payload behind.
      if (pending.current) timer.current = setTimeout(() => void run(), delay);
    }
  };

  const schedule = (value: T) => {
    pending.current = { value };
    setStatus("pending");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void run(), delay);
  };

  /** Write whatever is waiting, now. Also the unmount cleanup. */
  const flush = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const held = pending.current;
    pending.current = null;
    if (held) void saveRef.current(held.value);
  }, []);

  useEffect(() => flush, [flush]);

  return { status, schedule, flush, dirty: () => pending.current !== null };
}
