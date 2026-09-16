"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getServerSetup, getSetup, loadSetup, subscribeSetup } from "@/lib/setup/store";

/** What the workspace is connected to, per platform; null until the first read (or if it failed). */
export function useWorkspaceSetup() {
  const setup = useSyncExternalStore(subscribeSetup, getSetup, getServerSetup);
  useEffect(() => {
    void loadSetup();
  }, []);
  return setup;
}
