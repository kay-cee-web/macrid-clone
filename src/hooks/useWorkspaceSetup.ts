"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getConnections, getServerSnapshot, getSetup, loadSetup, subscribeSetup } from "@/lib/setup/store";

/** What the workspace is connected to, per platform; null until the first read (or if it failed). */
export function useWorkspaceSetup() {
  const setup = useSyncExternalStore(subscribeSetup, getSetup, getServerSnapshot);
  useEffect(() => {
    void loadSetup();
  }, []);
  return setup;
}

/** The raw connections behind it (record ids, account details), for connecting and disconnecting. */
export function useWorkspaceConnections() {
  const connections = useSyncExternalStore(subscribeSetup, getConnections, getServerSnapshot);
  useEffect(() => {
    void loadSetup();
  }, []);
  return connections;
}
