"use client";

import { useCallback, useEffect, useState } from "react";
import { mergeAgentLocally } from "@/lib/agents/actions";
import { isUnusedCopy, markUsed } from "@/lib/agents/fresh";
import { extractApiError } from "@/lib/api/errors";
import { failureMessage, newMessageId, replyMessage, userMessage, type ThreadMessage } from "@/lib/chat/conversation";import { changesSince, snapshotBeforeTurn } from "@/lib/records/receipts";
import { setTokenBalance } from "@/lib/tokens/balance";
import { fetchMessages, sendChatMessage } from "@/services/chat";
import type { ChatImage } from "@/types/agent";

export type { ThreadMessage };

type HistoryState = { agentId: string; fresh: boolean; status: "loading" | "ready" | "error"; error: string | null };

/** A new, unused copy has no history, so it skips the request. Fixed per agent: sending must not refetch. */
const initialHistory = (agentId: string): HistoryState => {
  const fresh = isUnusedCopy(agentId);
  return { agentId, fresh, status: fresh ? "ready" : "loading", error: null };
};

/**
 * The agent's conversation: history, sending, and instruction rewrites. The
 * backend keeps one thread per agent, so "New conversation" copies the agent.
 */
export function useChat(agentId: string) {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [history, setHistory] = useState<HistoryState>(() => initialHistory(agentId));
  const [sending, setSending] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const { fresh } = history;

  // Switching agent starts a new thread (reset during render, not in an effect).
  if (history.agentId !== agentId) {
    setHistory(initialHistory(agentId));
    setMessages([]);
  }

  useEffect(() => {
    if (fresh) return;
    let cancelled = false;
    fetchMessages(agentId)
      .then((rows) => {
        if (cancelled) return;
        setMessages((local) => [...rows, ...local]);
        setHistory({ agentId, fresh, status: "ready", error: null });
      })
      .catch((err) => {
        if (!cancelled) setHistory({ agentId, fresh, status: "error", error: extractApiError(err, "Could not load the conversation") });
      });
    return () => {
      cancelled = true;
    };
  }, [agentId, fresh, attempt]);

  const send = useCallback(
    async (text: string, images: ChatImage[] = []) => {
      const message = text.trim();
      if (!message || sending) return false;

      setMessages((list) => [...list, userMessage(message, images)]);
      setSending(true);
      markUsed(agentId);
      const before = await snapshotBeforeTurn();
      const replyId = newMessageId();
      // Even a failed turn may have done some work before it broke, so both get a receipt.
      const attachReceipt = () => {
        if (!before) return;
        void changesSince(before).then((changes) => {
          if (changes.length) setMessages((list) => list.map((m) => (m.id === replyId ? { ...m, changes } : m)));
        });
      };

      try {
        const result = await sendChatMessage(agentId, { message, images });
        if (result.instructions !== null) mergeAgentLocally(agentId, { instructions: result.instructions });
        setTokenBalance(result.usage.remaining);
        setMessages((list) => [...list, replyMessage(replyId, result)]);
        attachReceipt();
        return true;
      } catch (err) {
        setMessages((list) => [...list, failureMessage(replyId, err, { text: message, images })]);
        attachReceipt();
        return false;
      } finally {
        setSending(false);
      }
    },
    [agentId, sending],
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
      setHistory({ agentId, fresh: false, status: "loading", error: null });
      setAttempt((n) => n + 1);
    },
    send,
    retry,
  };
}
