"use client";

import { useSyncExternalStore } from "react";
import { readOpenSections, serverOpenSections, subscribeToSections, toggleSection } from "@/lib/ui/sections";

/** Stored with the sidebar's other open/closed choices; present means collapsed. */
const KEY = "sidebar:collapsed";

/** Whether the desktop sidebar is folded to its icon rail. Open on the server, like every section. */
export function useSidebarCollapsed() {
  const sections = useSyncExternalStore(subscribeToSections, readOpenSections, serverOpenSections);
  return { collapsed: sections.has(KEY), toggle: () => toggleSection(KEY) };
}
