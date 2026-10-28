"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { useCreateAgent } from "@/hooks/useCreateAgent";

export type AgentPrompt = {
  label: string;
  /** What the agent is sent; written as a whole task. */
  task: string;
  hint?: string;
  Icon: LucideIcon;
};

/**
 * Work started from a records page. A pick makes an agent and opens its chat
 * with the task already sent, the same as an idea card on home.
 */
export function AskAgent({ prompts, label }: { prompts: AgentPrompt[]; label: string }) {
  const { create, creating } = useCreateAgent();

  return (
    <ul aria-label={label} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {prompts.map(({ label: name, task, hint, Icon }) => (
        <li key={name}>
          <button
            type="button"
            disabled={creating}
            onClick={() => void create(task, [], { send: true })}
            className="group flex h-full w-full items-start gap-3 rounded-xl border border-line bg-surface p-4 text-left transition-colors hover:border-faint hover:bg-raised disabled:opacity-60"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent">
              <Icon className="size-4.5" />
            </span>
            <span className="grid min-w-0 flex-1 gap-0.5">
              <span className="text-sm font-medium text-ink">{name}</span>
              {hint && <span className="text-xs text-muted">{hint}</span>}
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-faint transition-colors group-hover:text-ink" />
          </button>
        </li>
      ))}
    </ul>
  );
}
