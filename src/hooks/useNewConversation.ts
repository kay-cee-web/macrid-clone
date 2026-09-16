"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { startConversation } from "@/lib/agents/actions";
import { extractApiError } from "@/lib/api/errors";
import type { Agent } from "@/types/agent";

/** "New conversation": copy the agent (history is per agent) and open the copy's chat. */
export function useNewConversation(agent: Agent) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);

  async function start() {
    if (starting) return;
    setStarting(true);
    try {
      const copy = await startConversation(agent);
      router.push(`/agents/${copy.id}`);
    } catch (err) {
      toast.error(extractApiError(err, "Could not start a new conversation"));
    } finally {
      setStarting(false);
    }
  }

  return { start, starting };
}
