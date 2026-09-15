"use client";

import { useRouter } from "next/navigation";
import { Copy, Ellipsis, Hash, MessageSquare, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { IconButton } from "@/components/ui/IconButton";
import { Menu } from "@/components/ui/Menu";
import { cloneAgent } from "@/lib/agents/actions";
import { extractApiError } from "@/lib/api/errors";
import type { Agent } from "@/types/agent";

export type AgentDialog = { type: "rename" | "delete"; agent: Agent } | null;

type AgentActionsMenuProps = {
  agent: Agent;
  /** Rename and delete open dialogs owned by the page, so there's one of each. */
  onDialog: (dialog: AgentDialog) => void;
  className?: string;
};

export function AgentActionsMenu({ agent, onDialog, className }: AgentActionsMenuProps) {
  const router = useRouter();

  const clone = async () => {
    const id = toast.loading(`Cloning ${agent.name}…`);
    try {
      const copy = await cloneAgent(agent);
      toast.success(`Created ${copy.name}.`, { id });
    } catch (err) {
      toast.error(extractApiError(err, "Could not clone the agent"), { id });
    }
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(agent.id);
      toast.success("Agent ID copied.");
    } catch {
      toast.error("Couldn't copy. Your browser blocked clipboard access.");
    }
  };

  return (
    <Menu
      className={className}
      items={[
        { label: "Open chat", icon: <MessageSquare />, onSelect: () => router.push(`/agents/${agent.id}`) },
        { label: "Rename", icon: <Pencil />, onSelect: () => onDialog({ type: "rename", agent }) },
        { label: "Clone", icon: <Copy />, onSelect: () => void clone() },
        { label: "Copy ID", icon: <Hash />, onSelect: () => void copyId() },
        { label: "Delete", icon: <Trash />, tone: "danger", onSelect: () => onDialog({ type: "delete", agent }) },
      ]}
      trigger={(props) => (
        <IconButton label={`Actions for ${agent.name}`} {...props}>
          <Ellipsis />
        </IconButton>
      )}
    />
  );
}
