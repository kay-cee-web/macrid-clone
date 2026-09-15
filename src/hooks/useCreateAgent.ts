"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAgent } from "@/lib/agents/actions";
import { extractApiError } from "@/lib/api/errors";
import type { ChatImage } from "@/types/agent";

/**
 * Create an agent and open it. With a task, the task becomes the agent's
 * instructions (the backend names the agent) and is drafted in its chat,
 * together with any images already uploaded.
 */
export function useCreateAgent() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  async function create(task = "", images: ChatImage[] = []) {
    const brief = task.trim();
    setCreating(true);
    try {
      const agent = await createAgent(brief ? { instructions: brief } : {});
      toast.success(`${agent.name} is ready.`);
      const query = new URLSearchParams();
      if (brief) query.set("task", brief);
      images.forEach((image) => query.append("img", image.url));
      const suffix = query.size ? `?${query.toString()}` : "";
      router.push(`/agents/${agent.id}${suffix}`);
      return agent;
    } catch (err) {
      toast.error(extractApiError(err, "Could not create the agent"));
      return null;
    } finally {
      setCreating(false);
    }
  }

  return { create, creating };
}
