"use client";

import { useRouter } from "next/navigation";
import { IdeaBrowser } from "@/components/agents/IdeaBrowser";
import type { Idea } from "@/types/idea";
import { WorkbenchTabs } from "./WorkbenchTabs";

/**
 * Every standing task, across categories. No agent is open here, so picking one
 * drafts it on the home composer — the same route a skill takes.
 */
export function WorkflowsCatalog() {
  const router = useRouter();
  const use = (idea: Idea) => router.push(`/?task=${encodeURIComponent(idea.description)}`);

  return (
    <div className="mx-auto grid w-full max-w-400 gap-8 px-4 pb-20 pt-10 sm:px-8 xl:px-14">
      <WorkbenchTabs />

      <header className="grid gap-2">
        <h1 className="font-sans text-2xl font-normal tracking-normal text-ink">Workflows</h1>
        <p className="max-w-[62ch] text-sm text-muted">
          Standing work an agent can take on, ready to hand over. Pick one and it lands on the composer, where it
          becomes an agent of its own.
        </p>
      </header>

      <IdeaBrowser heading={null} action="Use" onPick={use} />
    </div>
  );
}
