"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { useAgents } from "@/hooks/useAgents";
import { mergeAgentLocally } from "@/lib/agents/actions";
import {
  preferredAgent,
  readAgentUses,
  recordAgentUse,
  serverAgentUses,
  subscribeToAgentUses,
} from "@/lib/agents/lastUsed";
import { extractApiError } from "@/lib/api/errors";
import { setTokenBalance } from "@/lib/tokens/balance";
import { sendChatMessage } from "@/services/chat";
import type { Agent } from "@/types/agent";

/**
 * Hand a writing request to an agent and get its text back.
 *
 * The agent is the one last worked in from this browser, as on Briefing, and
 * picking another makes that the choice. The turn lands in that agent's chat
 * thread too — there is one thread per agent and no way to send off the record.
 *
 * `onReply` is skipped if the caller unmounted while the agent was writing
 * (another note was opened), since it would write into a note that's gone.
 */
export function useAskAgent(onReply: (reply: string) => void) {
  const { agents, status } = useAgents();
  const uses = useSyncExternalStore(subscribeToAgentUses, readAgentUses, serverAgentUses);
  const agent = preferredAgent(agents, uses);
  const [busy, setBusy] = useState(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const ask = async (message: string) => {
    if (!agent || busy) return false;
    setBusy(true);
    recordAgentUse(agent.id);
    try {
      const result = await sendChatMessage(agent.id, { message });
      if (result.instructions !== null) mergeAgentLocally(agent.id, { instructions: result.instructions });
      setTokenBalance(result.usage.remaining);
      if (!result.reply) throw new Error(`${agent.name} sent back nothing to add.`);
      if (!alive.current) {
        toast.warning(`The note was closed before ${agent.name} finished. Its text is in that agent's chat.`);
        return false;
      }
      onReply(result.reply);
      toast.success(`${agent.name} added to your note.`);
      return true;
    } catch (err) {
      toast.error(extractApiError(err, `${agent.name} could not write that`));
      return false;
    } finally {
      if (alive.current) setBusy(false);
    }
  };

  return {
    agents,
    agent,
    loading: status === "idle" || status === "loading",
    busy,
    ask,
    pick: (next: Agent) => recordAgentUse(next.id),
  };
}
