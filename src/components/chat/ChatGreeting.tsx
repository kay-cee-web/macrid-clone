"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AgentAvatar } from "@/components/agents/AgentAvatar";
import { useWorkspace } from "@/components/workspace/WorkspaceContext";
import { greetingFor } from "@/data/greetings";
import { useAuth } from "@/hooks/useAuth";
import { firstName } from "@/lib/format";
import type { Agent } from "@/types/agent";
import { GreetingSuggestions } from "./GreetingSuggestions";

type ChatGreetingProps = {
  agent: Agent;
  /** Sends the suggestion straight away, so it is held back mid-turn. */
  onPick: (text: string) => void;
  busy?: boolean;
};

const LINK = "font-medium text-accent hover:underline";
const TOKEN = /\[(records|instructions|plugins)\]/;

/**
 * The agent's first message: who it is, how it works, and where to start. It
 * heads the thread and stays there once messages begin, so the brief is always
 * at hand. Built on the client: the backend has no place to store a greeting turn.
 * The wording is one of `GREETINGS`, picked by the agent's id.
 */
export function ChatGreeting({ agent, onPick, busy }: ChatGreetingProps) {
  const { user } = useAuth();
  const { openInstructions } = useWorkspace();
  const name = firstName(user?.name) || "there";
  const brief = agent.instructions.trim();
  const greeting = greetingFor(agent.id);

  const links: Record<string, ReactNode> = {
    records: (
      <Link href="/records" className={LINK}>
        Records
      </Link>
    ),
    instructions: (
      <button type="button" onClick={openInstructions} className={LINK}>
        instructions
      </button>
    ),
    plugins: (
      <Link href={`/agents/${agent.id}/plugins`} className={LINK}>
        Plugins
      </Link>
    ),
  };

  // split() with a capture group puts each token's name at the odd indexes.
  const withLinks = (text: string) =>
    text.split(TOKEN).map((part, i) => (i % 2 ? <span key={i}>{links[part]}</span> : part));

  return (
    <div className="grid w-full gap-3 py-10">
      <div className="flex items-center gap-2 text-xs text-muted">
        <AgentAvatar name={agent.name} size="xs" />
        <span className="font-medium text-ink">{agent.name}</span>
      </div>
      <div className="grid gap-4 pl-7 text-sm leading-relaxed text-ink">
        <h2 className="font-display text-2xl font-semibold leading-snug">
          {greeting.hello(name)}
          <br />
          {greeting.title}
        </h2>
        {greeting.paragraphs.map((paragraph) => (
          <p key={paragraph}>{withLinks(paragraph)}</p>
        ))}
        {brief && (
          <div className="grid gap-2">
            <p>Here&apos;s what I&apos;ve been told so far:</p>
            <blockquote className="line-clamp-4 max-w-[65ch] border-l-2 border-accent pl-3 text-muted">
              {brief}
            </blockquote>
          </div>
        )}
        <GreetingSuggestions
          category={agent.category}
          onPick={onPick}
          disabled={busy}
        />
        <p>{greeting.closing}</p>
      </div>
    </div>
  );
}
