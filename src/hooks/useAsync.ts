"use client";

import { useCallback, useEffect, useState, type DependencyList } from "react";
import { extractApiError } from "@/lib/api/errors";

type AsyncState<T> = { data: T | null; status: "loading" | "ready" | "error"; error: string | null };

/**
 * Run a read-only request when `deps` change; ignore answers that arrive after
 * the inputs moved on. `reload()` runs it again, keeping the last data visible.
 */
export function useAsync<T>(load: () => Promise<T>, deps: DependencyList, fallbackError = "Something went wrong") {
  const [state, setState] = useState<AsyncState<T>>({ data: null, status: "loading", error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    load()
      .then((data) => {
        if (!cancelled) setState({ data, status: "ready", error: null });
      })
      .catch((err) => {
        if (!cancelled) setState((s) => ({ ...s, status: "error", error: extractApiError(err, fallbackError) }));
      });
    return () => {
      cancelled = true;
    };
    // The caller owns the dependency list, like useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
}
