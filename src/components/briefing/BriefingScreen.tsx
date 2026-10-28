"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AgentPicker } from "@/components/agents/AgentPicker";
import { useAgents } from "@/hooks/useAgents";
import { useCreateAgent } from "@/hooks/useCreateAgent";
import {
  preferredAgent,
  readAgentUses,
  recordAgentUse,
  serverAgentUses,
  subscribeToAgentUses,
} from "@/lib/agents/lastUsed";
import { BriefingView } from "./BriefingView";

/**
 * Briefing — what needs you today.
 *
 * A workspace section, not an agent's tab: it is gathered from the account's own
 * records, and it would be the same page whichever agent happened to be open.
 *
 * The actions still need an agent to carry them out, so the page names the one
 * that will get them and lets you change it. It defaults to the agent last
 * worked in from this browser — the account itself can't say, since a chat turn
 * leaves `agents.updated_at` alone — and falls back to the newest agent, which
 * is the most that can be known on a device that has never been used here.
 */
export function BriefingScreen() {
  const { agents } = useAgents();
  const { create } = useCreateAgent();
  const router = useRouter();
  const uses = useSyncExternalStore(subscribeToAgentUses, readAgentUses, serverAgentUses);

  const agent = preferredAgent(agents, uses);

  const act = (text: string) => {
    if (agent) router.push(`/agents/${agent.id}?task=${encodeURIComponent(text)}&send=1`);
    else void create(text, [], { send: true });
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Full width, the same shell as the Workbench and the Agent hub. */}
      <div className="mx-auto grid w-full max-w-400 gap-8 px-4 pb-20 pt-10 sm:px-8 xl:px-14">
        <div className="grid w-full gap-5">
          <div className="grid gap-1.5">
            <h1 className="text-2xl font-semibold">Briefing</h1>
            <p className="max-w-[62ch] text-sm text-muted">
              What needs you today, gathered from your records and the tools you&apos;ve connected. Nothing is changed
              until you watch it happen.
            </p>
            {/* A div, not a p: the picker's panel can't sit inside one. */}
            <div className="flex flex-wrap items-center gap-1 text-sm text-muted">
              <span>Actions go to</span>
              {agent ? (
                // Choosing one is using one, so it stays the choice.
                <AgentPicker agents={agents} selected={agent} onPick={(next) => recordAgentUse(next.id)} />
              ) : (
                <span className="font-medium text-ink">a new agent</span>
              )}
            </div>
          </div>

          <BriefingView onAct={act} />
        </div>
      </div>
    </div>
  );
}
