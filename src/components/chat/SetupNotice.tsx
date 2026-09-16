"use client";

import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { useWorkspaceSetup } from "@/hooks/useWorkspaceSetup";
import { missingIn, mentionsSending, platformNames, platformsMentioned } from "@/lib/setup/platforms";
import type { Agent } from "@/types/agent";

/**
 * A heads-up above the composer while the draft asks for something the
 * workspace can't do yet: a platform with nothing connected, or a send while
 * this agent's sending is off. It never blocks: the agent can still draft.
 */
export function SetupNotice({ agent, draft }: { agent: Agent; draft: string }) {
  const setup = useWorkspaceSetup();
  const text = draft.trim();
  if (text.length < 8) return null;

  const missing = missingIn(setup, platformsMentioned(text));
  const sendingOff = !agent.sendingEnabled && mentionsSending(text);
  if (!missing.length && !sendingOff) return null;

  return (
    <div role="status" className="mx-auto mb-2 grid w-full max-w-3xl gap-1.5 rounded-[12px] border border-warn/30 bg-warn-soft px-3 py-2 text-[13px]">
      {missing.length > 0 && (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <CircleAlert className="size-3.5 shrink-0 text-warn" />
          <span className="min-w-0 flex-1 text-ink">
            {platformNames(missing)} isn&apos;t connected, so {agent.name} can draft this but not send it.
          </span>
          <Link href={`/agents/${agent.id}/plugins?tab=connectors`} className="font-medium text-accent hover:underline">
            Connect {platformNames(missing)}
          </Link>
        </p>
      )}
      {sendingOff && (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <CircleAlert className="size-3.5 shrink-0 text-warn" />
          <span className="min-w-0 flex-1 text-ink">Sending is off for {agent.name}. It will prepare everything but nothing goes out.</span>
          <Link href={`/agents/${agent.id}/settings?section=general`} className="font-medium text-accent hover:underline">
            Turn sending on
          </Link>
        </p>
      )}
    </div>
  );
}
