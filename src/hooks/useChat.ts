"use client";

import { useCallback, useEffect, useState } from "react";
import { mergeAgentLocally } from "@/lib/agents/actions";
import { extractApiError } from "@/lib/api/errors";
import { isFreshConversation, newMessageId } from "@/lib/chat/conversation";
import { fetchMessages, sendChatMessage } from "@/services/chat";
import type { ChatImage, ChatMessage } from "@/types/agent";

export type ThreadMessage = ChatMessage & {
  /** On a failed turn: what to resend. */
  retry?: { text: string; images: ChatImage[] };
  /** On a reply that rewrote the agent's brief. */
  instructionsUpdated?: boolean;
};

type HistoryState = { key: string; status: "loading" | "ready" | "error"; error: string | null };

const now = () => new Date().toISOString();

/** One agent conversation: history, sending, and instruction rewrites. */
export function useChat(agentId: string, conversationId: string | null) {
  const key = `${agentId}:${conversationId ?? ""}`;
  const fresh = isFreshConversation(conversationId);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [history, setHistory] = useState<HistoryState>({ key, status: fresh ? "ready" : "loading", error: null });
  const [sending, setSending] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Switching agent or conversation starts a new thread (reset during render, not in an effect).
  if (history.key !== key) {
    setHistory({ key, status: fresh ? "ready" : "loading", error: null });
    setMessages([]);
  }

  useEffect(() => {
    if (fresh) return;
    let cancelled = false;
    fetchMessages(agentId)
      .then((rows) => {
        if (cancelled) return;
        setMessages((local) => [...rows, ...local]);
        setHistory({ key, status: "ready", error: null });
      })
      .catch((err) => {
        if (!cancelled) setHistory({ key, status: "error", error: extractApiError(err, "Could not load the conversation") });
      });
    return () => {
      cancelled = true;
    };
  }, [agentId, key, fresh, attempt]);

  const send = useCallback(
    async (text: string, images: ChatImage[] = []) => {
      const message = text.trim();
      if (!message || sending) return false;

      const userMessage: ThreadMessage = { id: newMessageId(), role: "user", text: message, at: now(), ...(images.length ? { images } : {}) };
      setMessages((list) => [...list, userMessage]);
      setSending(true);

      try {
        const { reply, instructions } = await sendChatMessage(agentId, {
          message,
          images,
          conversationId: conversationId ?? undefined,
        });
        if (instructions !== null) mergeAgentLocally(agentId, { instructions });
        const answer: ThreadMessage = {
          id: newMessageId(),
          role: "assistant",
          text: reply || "The agent finished without a written reply.",
          at: now(),
          instructionsUpdated: instructions !== null,
        };
        setMessages((list) => [...list, answer]);
        return true;
      } catch (err) {
        const failure: ThreadMessage = {
          id: newMessageId(),
          role: "assistant",
          text: extractApiError(err, "Could not reach the agent"),
          at: now(),
          error: true,
          retry: { text: message, images },
        };
        setMessages((list) => [...list, failure]);
        return false;
      } finally {
        setSending(false);
      }
    },
    [agentId, conversationId, sending],
  );

  /** Resend a failed turn: drop the error and the original, then send again. */
  const retry = useCallback(
    (failed: ThreadMessage) => {
      if (!failed.retry) return;
      setMessages((list) => {
        const at = list.findIndex((m) => m.id === failed.id);
        return list.filter((_, i) => i !== at && i !== at - 1);
      });
      void send(failed.retry.text, failed.retry.images);
    },
    [send],
  );

  return {
    messages,
    sending,
    historyStatus: history.status,
    historyError: history.error,
    reloadHistory: () => {
      setHistory({ key, status: "loading", error: null });
      setAttempt((n) => n + 1);
    },
    send,
    retry,
  };
}
