"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, SquarePen } from "lucide-react";
import { AgentActionsMenu, type AgentDialog } from "@/components/agents/AgentActionsMenu";
import { AgentAvatar } from "@/components/agents/AgentAvatar";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";
import { newConversationId } from "@/lib/chat/conversation";
import type { Agent } from "@/types/agent";

type WorkspaceHeaderProps = {
  agent: Agent;
  onInstructions: () => void;
  onDialog: (dialog: AgentDialog) => void;
};

export function WorkspaceHeader({ agent, onInstructions, onDialog }: WorkspaceHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const base = `/agents/${agent.id}`;
  const tabs = [
    { href: base, label: "Chat" },
    { href: `${base}/workflows`, label: "Workflows" },
    { href: `${base}/plugins`, label: "Plugins" },
    { href: `${base}/settings`, label: "Settings" },
  ];

  return (
    <header className="shrink-0 border-b border-line bg-surface">
      <div className="flex items-center gap-3 px-4 pt-3 sm:px-6">
        <AgentAvatar name={agent.name} size="sm" />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h1 className="truncate font-sans text-[15px] font-semibold tracking-normal">{agent.name}</h1>
          <Link href={`${base}/settings?section=general`} title="Change in Settings" className="hidden rounded-full sm:inline-flex">
            <Pill tone={agent.sendingEnabled ? "good" : "warn"} dot>
              {agent.sendingEnabled ? "Sending on" : "Sending off"}
            </Pill>
          </Link>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<SquarePen className="size-3.5" />}
          onClick={() => router.push(`${base}?c=${newConversationId()}`)}
          className="hidden sm:inline-flex"
        >
          New conversation
        </Button>
        <IconButton label="New conversation" className="sm:hidden" onClick={() => router.push(`${base}?c=${newConversationId()}`)}>
          <SquarePen />
        </IconButton>
        <IconButton label="Instructions" onClick={onInstructions}>
          <FileText />
        </IconButton>
        <AgentActionsMenu agent={agent} onDialog={onDialog} />
      </div>
      <nav aria-label="Agent sections" className="flex gap-1 overflow-x-auto px-3 sm:px-5">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "-mb-px border-b-2 px-2.5 pb-2.5 pt-3 text-[13.5px] transition-colors",
                active ? "border-ink font-medium text-ink" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
