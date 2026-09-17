import Link from "next/link";
import { Pill } from "@/components/ui/Pill";
import { categoryOf } from "@/lib/agents/category";
import { cn } from "@/lib/cn";
import { timeAgo } from "@/lib/format";
import type { Agent } from "@/types/agent";
import { AgentActionsMenu, type AgentDialog } from "./AgentActionsMenu";
import { AgentIcon } from "./AgentIcon";

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
    </>
  );
}

/** Stretches the name link over the whole card; the actions menu sits above it. */
function NameLink({ agent, rounded }: { agent: Agent; rounded: string }) {
  return (
    <Link
      href={`/agents/${agent.id}`}
      className={cn(
        "after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent",
        rounded,
      )}
    >
      {agent.name}
    </Link>
  );
}

/** The whole card opens the agent. */
export function AgentCard({ agent, layout, onDialog }: AgentCardProps) {
  const edited = timeAgo(agent.updatedAt);
  const brief = agent.instructions.trim();
  const category = categoryOf(agent);
  const briefText = brief || "No instructions yet. Open the agent and tell it what to do.";

  if (layout === "list") {
    return (
      <article className="group relative flex items-center gap-4 bg-surface px-4 py-3 transition-colors hover:bg-raised">
        <AgentIcon category={category} className="size-9 [&_svg]:size-4" />
        <div className="grid min-w-0 flex-1">
          <h3 className="truncate text-base font-medium">
            <NameLink agent={agent} rounded="focus-visible:after:ring-inset" />
          </h3>
          <span className="truncate text-xs text-faint">{edited ? `Edited ${edited}` : "Never edited"}</span>
        </div>
        <p className="hidden min-w-0 flex-2 truncate text-sm text-muted md:block">{brief}</p>
        <div className="hidden shrink-0 gap-1.5 sm:flex">
          <StatusPills agent={agent} />
        </div>
        <AgentActionsMenu agent={agent} onDialog={onDialog} className="relative z-10" />
      </article>
    );
  }

  const flag = !agent.isActive ? "Inactive" : !agent.sendingEnabled ? "Sending off" : null;

  return (
    <article
      title={edited ? `Edited ${edited}` : undefined}
      className="group relative grid content-start gap-8 rounded-3xl border border-line bg-raised/40 p-6 backdrop-blur transition-[background-color,box-shadow] duration-200 hover:bg-raised/80 hover:shadow-float"
    >
      <div className="flex items-start justify-between gap-3">
        <AgentIcon category={category} />
        {/* Hidden until hover or focus, so the card reads as icon + title + brief. Always shown on touch screens. */}
        <AgentActionsMenu
          agent={agent}
          onDialog={onDialog}
          className="relative z-10 -mr-2 -mt-2 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
        />
      </div>

      <div className="grid gap-3">
        <h3 className="flex min-w-0 items-center gap-2 text-xl text-ink">
          <span className="truncate">
            <NameLink agent={agent} rounded="after:rounded-3xl" />
          </span>
          {flag && (
            <span title={flag} className={cn("size-2 shrink-0 rounded-full", agent.isActive ? "bg-warn" : "bg-faint")}>
              <span className="sr-only">{flag}</span>
            </span>
          )}
        </h3>
        <p className={cn("line-clamp-2 min-h-13 text-base leading-relaxed", brief ? "text-muted" : "text-faint")}>
          {briefText}
        </p>
      </div>
    </article>
  );
}
