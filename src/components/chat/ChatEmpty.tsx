"use client";

import { AgentAvatar } from "@/components/agents/AgentAvatar";
import { useAuth } from "@/hooks/useAuth";
import { firstName } from "@/lib/format";
import type { Agent } from "@/types/agent";
import { SuggestionChips } from "./SuggestionChips";

/** A new thread: who the agent is, what it's been told, and where to start. */
export function ChatEmpty({ agent, onPick }: { agent: Agent; onPick: (text: string) => void }) {
  const { user } = useAuth();
  const name = firstName(user?.name);
  const brief = agent.instructions.trim();

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-8 py-10">
      <div className="grid justify-items-start gap-4">
        <AgentAvatar name={agent.name} size="lg" />
        <div className="grid gap-2">
          <h2 className="text-3xl font-semibold leading-tight">
            {name ? `Hey ${name}. ` : ""}What should {agent.name} work on?
          </h2>
          <p className="max-w-[60ch] text-sm text-muted">
            {brief
              ? "It already has a brief. Ask it to start, or refine what it should do."
              : "It doesn't have a brief yet. Describe the job and it will write its own instructions from the conversation."}
          </p>
        </div>
        {brief && (
          <blockquote className="line-clamp-4 max-w-[65ch] border-l-2 border-accent pl-3 text-sm leading-relaxed text-ink">
            {brief}
          </blockquote>
        )}
      </div>
      <SuggestionChips category={agent.category} onPick={onPick} />
    </div>
  );
}
