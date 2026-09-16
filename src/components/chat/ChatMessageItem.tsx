"use client";

import { CircleAlert, RotateCw } from "lucide-react";
import { AgentAvatar } from "@/components/agents/AgentAvatar";
import { Button } from "@/components/ui/Button";
import { buttonStyles } from "@/components/ui/button-styles";
import { Markdown } from "@/components/ui/Markdown";
import { Pill } from "@/components/ui/Pill";
import type { ThreadMessage } from "@/hooks/useChat";
import { macridAppLink } from "@/lib/config";
import { timeAgo } from "@/lib/format";
import { linkRecordMentions } from "@/lib/records/mentions";
import type { ChatImage } from "@/types/agent";
import { MessageActions } from "./MessageActions";
import { TurnReceipt } from "./TurnReceipt";
import { TurnUsage } from "./TurnUsage";

type ChatMessageItemProps = {
  message: ThreadMessage;
  agentName: string;
  onRetry: (message: ThreadMessage) => void;
  onViewInstructions?: () => void;
};

function ImageGrid({ images }: { images: ChatImage[] }) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      {images.map((image) => (
        <a key={image.url} href={image.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-[10px] border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element -- hosted user uploads on another domain */}
          <img src={image.url} alt={image.name} className="size-24 object-cover" />
        </a>
      ))}
    </div>
  );
}

export function ChatMessageItem({ message, agentName, onRetry, onViewInstructions }: ChatMessageItemProps) {
  if (message.role === "user") {
    return (
      <div className="group flex flex-col items-end gap-1.5">
        {message.images?.length ? <ImageGrid images={message.images} /> : null}
        <div className="max-w-[min(85%,36rem)] whitespace-pre-wrap rounded-[16px] rounded-br-[6px] border border-line bg-raised px-3.5 py-2.5 text-[14.5px] leading-relaxed [overflow-wrap:anywhere]">
          {message.text}
        </div>
        <MessageActions text={message.text} />
      </div>
    );
  }

  const receipt = message.changes?.length ? <TurnReceipt changes={message.changes} className="ml-7" /> : null;

  if (message.error) {
    return (
      <div className="grid gap-2">
        <div role="alert" className="flex flex-wrap items-start gap-3 rounded-[12px] border border-bad/30 bg-bad-soft px-3.5 py-3 text-bad">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <p className="min-w-0 flex-1 text-[13.5px]">{message.text}</p>
          <div className="flex gap-2">
            {message.outOfTokens && (
              <a href={macridAppLink("/settings/plans")} target="_blank" rel="noreferrer" className={buttonStyles({ size: "sm" })}>
                Upgrade plan
              </a>
            )}
            {message.retry && (
              <Button size="sm" variant="secondary" icon={<RotateCw className="size-3.5" />} onClick={() => onRetry(message)}>
                Retry
              </Button>
            )}
          </div>
        </div>
        {receipt}
      </div>
    );
  }

  return (
    <div className="group grid gap-2">
      <div className="flex items-center gap-2 text-[12.5px] text-muted">
        <AgentAvatar name={agentName} size="xs" />
        <span className="font-medium text-ink">{agentName}</span>
        {new Date(message.at).getTime() > 0 && <span className="text-faint">{timeAgo(message.at)}</span>}
        {message.usage && <TurnUsage usage={message.usage} />}
      </div>
      <Markdown className="pl-7">{linkRecordMentions(message.text)}</Markdown>
      {receipt}
      <div className="flex items-center gap-2 pl-6">
        {message.instructionsUpdated && (
          <button type="button" onClick={onViewInstructions} className="rounded-full" title="View the updated instructions">
            <Pill tone="accent" dot>
              Updated its instructions
            </Pill>
          </button>
        )}
        <MessageActions text={message.text} speak />
      </div>
    </div>
  );
}
