"use client";

import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { WorkingTrace } from "@/components/ui/WorkingTrace";
import type { ThreadMessage } from "@/hooks/useChat";
import { useWorkspaceSetup } from "@/hooks/useWorkspaceSetup";
import { connectorHints } from "@/lib/chat/connectorHints";
import { followUpsFor } from "@/lib/chat/followUps";
import { ChatMessageItem } from "./ChatMessageItem";
import { ConnectorHints } from "./ConnectorHints";
import { SuggestionList } from "./SuggestionList";

type ChatThreadProps = {
  messages: ThreadMessage[];
  agentId: string;
  agentName: string;
  sending: boolean;
  onRetry: (message: ThreadMessage) => void;
  onViewInstructions: () => void;
  /** Sends a follow-up suggestion straight away. */
  onPick: (text: string) => void;
  /** The greeting. It heads the thread and stays there once messages start. */
  header: ReactNode;
};

/** Scrollable message list that follows new messages to the bottom. */
export function ChatThread({ messages, agentId, agentName, sending, onRetry, onViewInstructions, onPick, header }: ChatThreadProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const hints = connectorHints(messages, useWorkspaceSetup());
  // Only under the latest reply, and gone while the next turn runs.
  const followUps = sending ? [] : followUpsFor(messages);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: messages.length > 1 ? "smooth" : "auto" });
  }, [messages.length, sending]);

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6 pb-8">
      {header}
      {messages.length > 0 && (
        <div role="log" aria-live="polite" aria-label={`Conversation with ${agentName}`} className="grid gap-6">
          {messages.map((message) => {
            const offered = hints.get(message.id);
            return (
              <Fragment key={message.id}>
                <ChatMessageItem
                  message={message}
                  agentName={agentName}
                  onRetry={onRetry}
                  onViewInstructions={onViewInstructions}
                />
                {offered && <ConnectorHints hints={offered} agentId={agentId} className="-mt-3 ml-7 max-w-xl" />}
              </Fragment>
            );
          })}
          <SuggestionList items={followUps} onPick={onPick} className="-mt-3 ml-7 max-w-xl" />
        </div>
      )}
      {sending && <WorkingTrace label={`${agentName} is working…`} className="pl-1" />}
      <div ref={endRef} />
    </div>
  );
}
