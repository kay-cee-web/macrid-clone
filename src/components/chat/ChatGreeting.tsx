"use client";

import { AgentAvatar } from "@/components/agents/AgentAvatar";
import { useAuth } from "@/hooks/useAuth";
import { useDayPart } from "@/hooks/useGreeting";
import { firstName } from "@/lib/format";
import { salutationOf } from "@/lib/greeting";
import type { Agent } from "@/types/agent";
import { SuggestionChips } from "./SuggestionChips";

type ChatGreetingProps = {
  agent: Agent;
  /** Sends the suggestion straight away, so it is held back mid-turn. */
  onPick: (text: string) => void;
  busy?: boolean;
};

/**
 * Who the agent is, what it's been told, and where to start. It heads the
 * thread and stays there once messages begin, so the brief is always at hand.
 * Built on the client: the backend has no place to store a greeting turn.
 */
export function ChatGreeting({ agent, onPick, busy }: ChatGreetingProps) {
  const { user } = useAuth();
  const part = useDayPart();
  const name = firstName(user?.name);
  const brief = agent.instructions.trim();
  // "Good evening, Evan." once the client's clock is known; "Hey Evan." before that.
  const hello = name ? `${part ? `${salutationOf(part)}, ` : "Hey "}${name}. ` : "";

  return (
    <div className="grid w-full gap-8 py-10">
      <div className="grid justify-items-start gap-4">
        <AgentAvatar name={agent.name} size="lg" />
        <div className="grid gap-2">
          <h2 className="text-3xl font-semibold leading-tight">
            {hello}What should {agent.name} work on?
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
      <SuggestionChips category={agent.category} onPick={onPick} disabled={busy} />
    </div>
  );
}
