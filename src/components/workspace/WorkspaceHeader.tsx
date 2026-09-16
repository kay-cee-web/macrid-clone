"use client";

import Link from "next/link";
import { FileText, SquarePen } from "lucide-react";
import { AgentActionsMenu, type AgentDialog } from "@/components/agents/AgentActionsMenu";
import { AgentAvatar } from "@/components/agents/AgentAvatar";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Pill } from "@/components/ui/Pill";
import { RouteTabs } from "@/components/ui/RouteTabs";
import { useNewConversation } from "@/hooks/useNewConversation";
import type { Agent } from "@/types/agent";
import { TokenBalance } from "./TokenBalance";

type WorkspaceHeaderProps = {
  agent: Agent;
  onInstructions: () => void;
  onDialog: (dialog: AgentDialog) => void;
};

export function WorkspaceHeader({ agent, onInstructions, onDialog }: WorkspaceHeaderProps) {
  const conversation = useNewConversation(agent);
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
        <TokenBalance className="hidden md:inline-flex" />
        <Button
          variant="secondary"
          size="sm"
          icon={<SquarePen className="size-3.5" />}
          loading={conversation.starting}
          onClick={() => void conversation.start()}
          className="hidden sm:inline-flex"
        >
          New conversation
        </Button>
        <IconButton
          label="New conversation"
          className="sm:hidden"
          disabled={conversation.starting}
          onClick={() => void conversation.start()}
        >
          <SquarePen />
        </IconButton>
        <IconButton label="Instructions" onClick={onInstructions}>
          <FileText />
        </IconButton>
        <AgentActionsMenu agent={agent} onDialog={onDialog} />
      </div>
      <RouteTabs label="Agent sections" tabs={tabs} className="px-3 sm:px-5" />
    </header>
  );
}
