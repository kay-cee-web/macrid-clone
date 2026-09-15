"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Bot, CircleAlert } from "lucide-react";
import { AgentDialogs } from "@/components/agents/AgentDialogs";
import type { AgentDialog } from "@/components/agents/AgentActionsMenu";
import { Button } from "@/components/ui/Button";
import { buttonStyles } from "@/components/ui/button-styles";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAgent } from "@/hooks/useAgents";
import { InstructionsModal } from "./InstructionsModal";
import { WorkspaceContext } from "./WorkspaceContext";
import { WorkspaceHeader } from "./WorkspaceHeader";

/** Frame for every /agents/[id] view: loads the agent, shows the header, hosts shared dialogs. */
export function AgentWorkspace({ id, children }: { id: string; children: ReactNode }) {
  const { agent, status, error, reload } = useAgent(id);
  const [dialog, setDialog] = useState<AgentDialog>(null);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  if (!agent && (status === "idle" || status === "loading")) {
    return (
      <div className="grid gap-4 p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-7 rounded-[8px]" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!agent) {
    const failed = status === "error";
    return (
      <div className="mx-auto max-w-2xl px-4 pt-16">
        <EmptyState
          tone={failed ? "bad" : "neutral"}
          icon={failed ? <CircleAlert /> : <Bot />}
          title={failed ? "Couldn't load this agent" : "Agent not found"}
          description={failed ? error : "It may have been deleted, or the link is wrong."}
          action={
            failed ? (
              <Button variant="secondary" onClick={() => void reload()}>Try again</Button>
            ) : (
              <Link href="/agents/all" className={buttonStyles({ variant: "secondary" })}>See all agents</Link>
            )
          }
        />
      </div>
    );
  }

  return (
    <WorkspaceContext.Provider
      value={{ agent, openInstructions: () => setInstructionsOpen(true), openDialog: setDialog }}
    >
      <div className="flex h-full flex-col">
        <WorkspaceHeader agent={agent} onInstructions={() => setInstructionsOpen(true)} onDialog={setDialog} />
        <div className="min-h-0 flex-1">{children}</div>
      </div>
      {instructionsOpen && <InstructionsModal agent={agent} onClose={() => setInstructionsOpen(false)} />}
      <AgentDialogs dialog={dialog} onClose={() => setDialog(null)} />
    </WorkspaceContext.Provider>
  );
}
