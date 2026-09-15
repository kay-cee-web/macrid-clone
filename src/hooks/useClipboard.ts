"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

/** Copy text; `copied` flips on for a moment only when the write actually succeeded. */
export function useClipboard(resetMs = 1600) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), resetMs);
    return () => clearTimeout(timer);
  }, [copied, resetMs]);

  const copy = useCallback(async (text: string, successMessage?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (successMessage) toast.success(successMessage);
      return true;
    } catch {
      toast.error("Couldn't copy. Your browser blocked clipboard access.");
      return false;
    }
  }, []);

  return { copied, copy };
}
