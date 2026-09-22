"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IdeaCard } from "@/components/agents/IdeaCard";
import { WorkspaceConnectorFlows } from "@/components/plugins/ConnectorFlows";
import { TileGrid } from "@/components/ui/TileGrid";
import { FilterChips } from "@/components/ui/FilterChips";
import { CATEGORIES, ideasFor } from "@/data/ideas";
import type { IdeaCategory } from "@/types/idea";
import { ScheduledWork } from "./ScheduledWork";
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
  const draftInChat = (text: string) => router.push(`/agents/${agent.id}?task=${encodeURIComponent(text)}`);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto grid w-full max-w-400 gap-5 px-4 pb-16 pt-8 sm:px-6 xl:px-10">
        <div className="grid gap-1.5">
          <h2 className="text-2xl font-semibold">Workflows</h2>
          <p className="max-w-[62ch] text-sm text-muted">
            Standing tasks {agent.name} can take on. Pick one and it goes to the chat as a message, where the agent
            starts on it.
          </p>
        </div>

        <ScheduledWork agentName={agent.name} onSend={sendToChat} onDraft={draftInChat} />

        <FilterChips
          label="Workflow categories"
          value={filter}
          onChange={setFilter}
          items={[{ value: "suggested", label: "Suggested" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
        />

        <WorkspaceConnectorFlows>
          <TileGrid>
            {ideas.map((idea) => (
              <IdeaCard
                key={`${idea.category}-${idea.title}`}
                idea={idea}
                variant="cover"
                action="Send to chat"
                onPick={() => sendToChat(idea.description)}
              />
            ))}
          </TileGrid>
        </WorkspaceConnectorFlows>
      </div>
    </div>
  );
}
