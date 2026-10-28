"use client";

import { useCallback, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { AgentAvatar } from "@/components/agents/AgentAvatar";
import { Input } from "@/components/ui/Input";
import { useDismiss } from "@/hooks/useDismiss";
import { cn } from "@/lib/cn";
import type { Agent } from "@/types/agent";

/**
 * Which agent gets the work.
 *
 * A search field rather than a plain menu, because an account can hold dozens of
 * agents and a list that long is a scroll, not a choice. The field takes the
 * focus on open, so picking one is type-a-few-letters-and-Enter.
 */
export function AgentPicker({
  agents,
  selected,
  onPick,
}: {
  agents: Agent[];
  selected: Agent;
  onPick: (agent: Agent) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);
  useDismiss(open, rootRef, close);

  const needle = query.trim().toLowerCase();
  const shown = needle ? agents.filter((agent) => agent.name.toLowerCase().includes(needle)) : agents;

  const pick = (agent: Agent) => {
    onPick(agent);
    close();
  };

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((on) => !on)}
        className="inline-flex items-center gap-1 rounded-lg px-1.5 py-0.5 font-medium text-ink transition-colors hover:bg-raised"
      >
        {selected.name}
        <ChevronDown className="size-3.5 text-muted" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-64 animate-fade-in rounded-[12px] border border-line bg-surface p-1 shadow-float">
          <div className="p-1">
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && shown[0]) pick(shown[0]);
                if (event.key === "Escape") close();
              }}
              placeholder="Search agents"
              aria-label="Search agents"
              leading={<Search />}
              className="h-9"
            />
          </div>

          <div role="listbox" aria-label="Agents" className="max-h-64 overflow-y-auto">
            {shown.length === 0 && <p className="px-2.5 py-2 text-xs text-muted">No agent matches that.</p>}
            {shown.map((agent) => (
              <button
                key={agent.id}
                type="button"
                role="option"
                aria-selected={agent.id === selected.id}
                onClick={() => pick(agent)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                  agent.id === selected.id ? "bg-raised text-ink" : "text-ink hover:bg-raised/60",
                )}
              >
                <AgentAvatar name={agent.name} size="xs" />
                <span className="flex-1 truncate">{agent.name}</span>
                {agent.id === selected.id && <Check className="size-4 shrink-0 text-accent" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
