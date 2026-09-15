"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IdeaCard } from "@/components/agents/IdeaCard";
import { HairlineGrid } from "@/components/ui/HairlineGrid";
import { Tabs } from "@/components/ui/Tabs";
import { CATEGORIES, ideasFor } from "@/data/ideas";
import type { IdeaCategory } from "@/types/idea";
import { useWorkspace } from "./WorkspaceContext";

type Filter = "suggested" | IdeaCategory;

/** Standing tasks for this agent. Picking one sends it straight to the chat. */
export function WorkflowsView() {
  const { agent } = useWorkspace();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("suggested");
  const ideas = ideasFor(filter === "suggested" ? agent.category : filter);

  const sendToChat = (text: string) =>
    router.push(`/agents/${agent.id}?task=${encodeURIComponent(text)}&send=1`);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto grid w-full max-w-5xl gap-5 px-4 pb-16 pt-8 sm:px-6">
        <div className="grid gap-1.5">
          <h2 className="text-[24px] font-semibold">Workflows</h2>
          <p className="max-w-[62ch] text-[14.5px] text-muted">
            Standing tasks {agent.name} can take on. Pick one and it goes to the chat as a message, where the agent
            starts on it.
          </p>
        </div>

        <Tabs
          label="Workflow categories"
          value={filter}
          onChange={setFilter}
          items={[{ value: "suggested", label: "Suggested" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
        />

        <HairlineGrid itemCount={ideas.length}>
          {ideas.map((idea) => (
            <IdeaCard
              key={`${idea.category}-${idea.title}`}
              idea={idea}
              eyebrow={filter === "suggested" ? idea.category : undefined}
              onPick={() => sendToChat(idea.description)}
            />
          ))}
        </HairlineGrid>
      </div>
    </div>
  );
}
