"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { WorkingTrace } from "@/components/ui/WorkingTrace";
import type { ThreadMessage } from "@/hooks/useChat";
import { ChatMessageItem } from "./ChatMessageItem";

type ChatThreadProps = {
  messages: ThreadMessage[];
  agentName: string;
  sending: boolean;
  onRetry: (message: ThreadMessage) => void;
  onViewInstructions: () => void;
  /** Shown instead of messages when the thread is empty. */
  empty: ReactNode;
};

/** Scrollable message list that follows new messages to the bottom. */
export function ChatThread({ messages, agentName, sending, onRetry, onViewInstructions, empty }: ChatThreadProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: messages.length > 1 ? "smooth" : "auto" });
  }, [messages.length, sending]);

  if (messages.length === 0 && !sending) return <>{empty}</>;

  return (
    <div role="log" aria-live="polite" aria-label={`Conversation with ${agentName}`} className="mx-auto grid w-full max-w-3xl gap-6 py-8">
      {messages.map((message) => (
        <ChatMessageItem
          key={message.id}
          message={message}
          agentName={agentName}
          onRetry={onRetry}
          onViewInstructions={onViewInstructions}
        />
      ))}
      {sending && <WorkingTrace label={`${agentName} is working…`} className="pl-1" />}
      <div ref={endRef} />
    </div>
  );
}
