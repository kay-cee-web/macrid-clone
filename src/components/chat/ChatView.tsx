"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useWorkspace } from "@/components/workspace/WorkspaceContext";
import { useChat } from "@/hooks/useChat";
import { nameFromUrl } from "@/lib/files";
import { ApprovalBar } from "./ApprovalBar";
import { ChatGreeting } from "./ChatGreeting";
import { SetupNotice } from "./SetupNotice";
import { ChatThread } from "./ChatThread";
import { ComposerWithAttachments } from "./ComposerWithAttachments";

/**
 * URL options: ?task= draft text, ?img= staged image URLs, ?send=1 sends the
 * task as soon as history has loaded.
 */
export function ChatView() {
  const { agent, openInstructions } = useWorkspace();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const autoSend = params.get("send") === "1";

  const [draft, setDraft] = useState(() => (autoSend ? "" : params.get("task") ?? ""));
  const [initialImages] = useState(() => (autoSend ? [] : params.getAll("img")));
  const chat = useChat(agent.id);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const autoSent = useRef(false);
  const historyReady = chat.historyStatus === "ready";

  useEffect(() => {
    const task = params.get("task")?.trim();
    if (!autoSend || !task || !historyReady || autoSent.current) return;
    autoSent.current = true;
    void chat.send(task, params.getAll("img").map((url) => ({ url, name: nameFromUrl(url) })));
    router.replace(pathname, { scroll: false });
  }, [autoSend, historyReady, params, chat, pathname, router]);

  const pick = (text: string) => {
    setDraft(text);
    composerRef.current?.focus();
  };

  /** A suggestion is a whole task, so it goes straight out rather than into the draft. */
  const sendNow = (text: string) => {
    if (!historyReady || chat.sending) return;
    void chat.send(text);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
        {chat.historyStatus === "loading" ? (
          <div className="mx-auto grid max-w-3xl gap-6 py-8">
            <Skeleton className="ml-auto h-10 w-2/3 rounded-[16px]" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="ml-auto h-10 w-1/2 rounded-[16px]" />
          </div>
        ) : chat.historyStatus === "error" ? (
          <div className="mx-auto max-w-2xl py-12">
            <EmptyState
              tone="bad"
              icon={<CircleAlert />}
              title="Couldn't load the conversation"
              description={chat.historyError}
              action={<Button variant="secondary" onClick={chat.reloadHistory}>Try again</Button>}
            />
          </div>
        ) : (
          <ChatThread
            messages={chat.messages}
            agentName={agent.name}
            sending={chat.sending}
            onRetry={chat.retry}
            onViewInstructions={openInstructions}
            header={<ChatGreeting agent={agent} onPick={sendNow} busy={!historyReady || chat.sending} />}
          />
        )}
      </div>

      <div className="shrink-0 px-4 pb-4 sm:px-6">
        <ApprovalBar
          agent={agent}
          messages={chat.messages}
          busy={chat.sending || !historyReady}
          onReply={(text) => void chat.send(text)}
          onEdit={() => pick("Change the draft: ")}
        />
        <SetupNotice agent={agent} draft={draft} />
        <ComposerWithAttachments
          id="chat-message"
          label={`Message ${agent.name}`}
          className="mx-auto w-full max-w-3xl"
          textareaRef={composerRef}
          value={draft}
          onChange={setDraft}
          initialImageUrls={initialImages}
          disabled={!historyReady}
          submitting={chat.sending}
          submitLabel="Send"
          placeholder={`Ask ${agent.name} to do something…`}
          onSubmit={(text, images) => {
            if (!historyReady || chat.sending) return false;
            void chat.send(text, images);
            return true;
          }}
        />
      </div>
    </div>
  );
}
