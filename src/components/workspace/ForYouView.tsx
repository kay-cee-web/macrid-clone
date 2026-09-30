"use client";

import { useRouter } from "next/navigation";
import { BriefingView } from "@/components/briefing/BriefingView";
import { useWorkspace } from "./WorkspaceContext";

/**
 * "For you" — what needs the user today, inside the agent that can act on it.
 *
 * It lives here rather than on home because every button is a thing for an
 * agent to do, and on home there is no agent to do it. Picking one sends the
 * sentence to this agent's chat the same way a workflow does, so the user
 * watches the work happen and the receipt under the reply says what changed.
 */
export function ForYouView() {
  const { agent } = useWorkspace();
  const router = useRouter();

  const sendToChat = (text: string) =>
    router.push(`/agents/${agent.id}?task=${encodeURIComponent(text)}&send=1`);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto grid w-full max-w-400 gap-5 px-4 pb-16 pt-8 sm:px-6 xl:px-10">
        <div className="grid gap-1.5">
          <h2 className="text-2xl font-semibold">For you</h2>
          <p className="max-w-[62ch] text-sm text-muted">
            What needs you today, gathered from your records and the tools you&apos;ve connected. Picking an action
            sends it to {agent.name} in the chat — nothing is changed until you watch it happen.
          </p>
        </div>

        {/* The reading column stays narrow inside the tab's container: this is read, not scanned. */}
        <div className="w-full max-w-3xl">
          <BriefingView onAct={sendToChat} />
        </div>
      </div>
    </div>
  );
}
