"use client";

import { createContext, useContext } from "react";
import type { AgentDialog } from "@/components/agents/AgentActionsMenu";
import type { Agent } from "@/types/agent";

type WorkspaceValue = {
  agent: Agent;
  openInstructions: () => void;
  /** Rename/delete dialogs hosted by AgentWorkspace. */
  openDialog: (dialog: AgentDialog) => void;
};

export const WorkspaceContext = createContext<WorkspaceValue | null>(null);

/** The open agent, for any view inside /agents/[id]. */
export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("useWorkspace must be used inside <AgentWorkspace>.");
  return value;
}
