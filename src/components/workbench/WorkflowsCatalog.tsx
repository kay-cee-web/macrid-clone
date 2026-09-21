"use client";

import { IdeaBrowser } from "@/components/agents/IdeaBrowser";
import { useCreateAgent } from "@/hooks/useCreateAgent";
import type { Idea } from "@/types/idea";
import { WorkbenchTabs } from "./WorkbenchTabs";

/**
 * Every standing task, across categories. No agent is open here, so picking one
 * makes the agent and opens its chat with the task already sent — as on home.
 */
export function WorkflowsCatalog() {
  const { create, creating } = useCreateAgent();
  const use = (idea: Idea) => void create(idea.description, [], { send: true });

  return (
    <div className="mx-auto grid w-full max-w-400 gap-8 px-4 pb-20 pt-10 sm:px-8 xl:px-14">
      <WorkbenchTabs />

      <header className="grid gap-2">
        <h1 className="font-sans text-2xl font-normal tracking-normal text-ink">Workflows</h1>
        <p className="max-w-[62ch] text-sm text-muted">
          Standing work an agent can take on, ready to hand over. Pick one and it becomes an agent of its own, already
          at work on it.
        </p>
      </header>

      <IdeaBrowser heading={null} action="Use" onPick={use} disabled={creating} />
    </div>
  );
}
