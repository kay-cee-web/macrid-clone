"use client";

import { MoreHorizontal, Pause, Pencil, Play, Trash2 } from "lucide-react";
import { Menu } from "@/components/ui/Menu";
import { Pill } from "@/components/ui/Pill";
import { describeSchedule, nextRunLabel } from "@/lib/automations/schedule";
import { cn } from "@/lib/cn";
import type { Automation } from "@/types/automation";

export type AutomationAction = "run" | "toggle" | "edit" | "delete";

type AutomationCardProps = {
  automation: Automation;
  /** Set while a request for this task is in flight; its menu waits. */
  busy?: boolean;
  onAction: (action: AutomationAction, automation: Automation) => void;
};

/** One scheduled task: what it does, when, and a menu to run, pause, edit or delete it. */
export function AutomationCard({ automation, busy, onAction }: AutomationCardProps) {
  const { name, prompt, active, nextRunAt, lastError } = automation;
  const next = active ? nextRunLabel(nextRunAt) : "";
  const act = (action: AutomationAction) => () => onAction(action, automation);

  return (
    <article className={cn("grid gap-2 rounded-xl border border-line bg-surface p-4", busy && "opacity-60")}>
      <div className="flex items-start gap-3">
        <h4 className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{name}</h4>
        <Menu
          items={[
            { label: "Run now", icon: <Play />, onSelect: act("run"), disabled: busy },
            active
              ? { label: "Pause", icon: <Pause />, onSelect: act("toggle"), disabled: busy }
              : { label: "Resume", icon: <Play />, onSelect: act("toggle"), disabled: busy },
            { label: "Edit", icon: <Pencil />, onSelect: act("edit"), disabled: busy },
            { label: "Delete", icon: <Trash2 />, onSelect: act("delete"), tone: "danger", disabled: busy },
          ]}
          trigger={(props) => (
            <button
              type="button"
              {...props}
              aria-label={`Actions for ${name}`}
              className="-m-1 grid size-7 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-raised hover:text-ink"
            >
              <MoreHorizontal className="size-4" />
            </button>
          )}
        />
      </div>
      {prompt && <p className="line-clamp-2 text-sm text-muted">{prompt}</p>}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
        <Pill tone={active ? "good" : "neutral"} dot>
          {active ? "Active" : "Paused"}
        </Pill>
        <span>{describeSchedule(automation)}</span>
        {next && <span className="text-faint">· Next {next}</span>}
      </div>
      {lastError && <p className="text-xs text-bad">Last run failed: {lastError}</p>}
    </article>
  );
}
