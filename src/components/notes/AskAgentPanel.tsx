"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { AgentPicker } from "@/components/agents/AgentPicker";
import { Button } from "@/components/ui/Button";
import type { Agent } from "@/types/agent";

/**
 * What to write, and which agent writes it.
 *
 * Enter sends and Shift+Enter starts a new line, as in the chat composer. The
 * draft is kept while the agent works, so a failed turn can be sent again as is.
 */
export function AskAgentPanel({
  agents,
  agent,
  loading,
  busy,
  onPick,
  onAsk,
}: {
  agents: Agent[];
  agent: Agent | null;
  loading: boolean;
  busy: boolean;
  onPick: (agent: Agent) => void;
  onAsk: (request: string) => Promise<boolean>;
}) {
  const [request, setRequest] = useState("");

  const submit = async () => {
    if (!request.trim() || busy) return;
    if (await onAsk(request)) setRequest("");
  };

  if (!agent) {
    return (
      <p className="p-1 text-sm text-muted">
        {loading ? (
          "Loading your agents…"
        ) : (
          <>
            You don&apos;t have an agent yet.{" "}
            <Link href="/" className="font-medium text-accent hover:underline">
              Create one on Home
            </Link>{" "}
            and it can write here.
          </>
        )}
      </p>
    );
  }

  return (
    <form
      className="grid gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <textarea
        autoFocus
        rows={3}
        value={request}
        disabled={busy}
        onChange={(event) => setRequest(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
          event.preventDefault();
          void submit();
        }}
        placeholder="Write a project brief, summarise this note, draft a follow-up email…"
        aria-label="What should the agent write?"
        className="w-full resize-none rounded-[10px] border border-line bg-surface px-3 py-2 text-base text-ink outline-none transition-colors placeholder:text-faint focus:border-accent focus:ring-3 focus:ring-accent-soft disabled:opacity-60 sm:text-sm"
      />
      {/* A div, not a p: the picker's panel can't sit inside one. */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1 text-xs text-muted">
          <span className="shrink-0">Written by</span>
          <AgentPicker agents={agents} selected={agent} onPick={onPick} />
        </div>
        <Button type="submit" size="sm" loading={busy} disabled={!request.trim()} iconRight={<ArrowUp />}>
          {busy ? "Writing" : "Write"}
        </Button>
      </div>
    </form>
  );
}
