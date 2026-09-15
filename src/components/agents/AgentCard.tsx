import Link from "next/link";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";
import { timeAgo } from "@/lib/format";
import type { Agent } from "@/types/agent";
import { AgentActionsMenu, type AgentDialog } from "./AgentActionsMenu";
import { AgentAvatar } from "./AgentAvatar";

type AgentCardProps = {
  agent: Agent;
  layout: "grid" | "list";
  onDialog: (dialog: AgentDialog) => void;
};

function StatusPills({ agent }: { agent: Agent }) {
  return (
    <>
      {!agent.isActive && <Pill>Inactive</Pill>}
      {!agent.sendingEnabled && (
        <Pill tone="warn" dot>
          Sending off
        </Pill>
      )}
      {agent.model && <Pill>{agent.model}</Pill>}
    </>
  );
}

/** The whole card opens the agent; the actions menu sits above the link. */
export function AgentCard({ agent, layout, onDialog }: AgentCardProps) {
  const edited = timeAgo(agent.updatedAt);
  const brief = agent.instructions.trim();

  return (
    <article
      className={cn(
        "group relative bg-surface transition-colors hover:bg-raised",
        layout === "grid" ? "grid content-start gap-3 p-4" : "flex items-center gap-3 px-4 py-3",
      )}
    >
      <div className={cn("flex min-w-0 items-center gap-3", layout === "list" && "flex-1")}>
        <AgentAvatar name={agent.name} />
        <div className="grid min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold">
            <Link
              href={`/agents/${agent.id}`}
              className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-accent"
            >
              {agent.name}
            </Link>
          </h3>
          <span className="truncate text-[12.5px] text-faint">{edited ? `Edited ${edited}` : "Never edited"}</span>
        </div>
        {layout === "grid" && <AgentActionsMenu agent={agent} onDialog={onDialog} className="relative z-10" />}
      </div>

      {layout === "grid" ? (
        <>
          <p className={cn("line-clamp-2 min-h-10 text-[13px] leading-relaxed", brief ? "text-muted" : "text-faint")}>
            {brief || "No instructions yet. Open the agent and tell it what to do."}
          </p>
          <div className="flex flex-wrap gap-1.5 empty:hidden">
            <StatusPills agent={agent} />
          </div>
        </>
      ) : (
        <>
          <p className="hidden min-w-0 flex-[2] truncate text-[13px] text-muted md:block">{brief}</p>
          <div className="hidden shrink-0 gap-1.5 sm:flex">
            <StatusPills agent={agent} />
          </div>
          <AgentActionsMenu agent={agent} onDialog={onDialog} className="relative z-10" />
        </>
      )}
    </article>
  );
}
