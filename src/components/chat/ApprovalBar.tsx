"use client";

import { Check, PenLine, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { asksForApproval, hasApprovalRule } from "@/lib/agents/approval";
import type { ThreadMessage } from "@/lib/chat/conversation";
import type { Agent } from "@/types/agent";

type ApprovalBarProps = {
  agent: Agent;
  messages: ThreadMessage[];
  busy: boolean;
  onReply: (text: string) => void;
  onEdit: () => void;
};

/** One-tap answers when the agent (with "Ask before sending" on) is waiting for a go-ahead. */
export function ApprovalBar({ agent, messages, busy, onReply, onEdit }: ApprovalBarProps) {
  const last = messages.at(-1);
  const waiting = hasApprovalRule(agent.instructions) && last?.role === "assistant" && !last.error && asksForApproval(last.text);
  if (!waiting || busy) return null;

  return (
    <div className="mx-auto mb-2 flex w-full max-w-3xl flex-wrap items-center gap-2 rounded-[12px] border border-line bg-surface px-3 py-2">
      <p className="min-w-0 flex-1 basis-48 text-sm text-muted">
        {agent.name} is waiting for your go-ahead.
        {!agent.sendingEnabled && <span className="text-warn"> Sending is off for this agent, so nothing will go out.</span>}
      </p>
      <Button size="sm" variant="ghost" icon={<PenLine className="size-3.5" />} onClick={onEdit}>
        Ask for changes
      </Button>
      <Button size="sm" variant="secondary" icon={<X className="size-3.5" />} onClick={() => onReply("Don't send it. Keep the draft.")}>
        Don&apos;t send
      </Button>
      <Button size="sm" icon={<Check className="size-3.5" />} onClick={() => onReply("send")}>
        Send
      </Button>
    </div>
  );
}
