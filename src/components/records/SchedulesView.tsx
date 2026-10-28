"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, CalendarSync, CircleAlert, RefreshCw, Sunrise } from "lucide-react";
import { AutomationCard } from "@/components/workspace/AutomationCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAgents } from "@/hooks/useAgents";
import { useAsync } from "@/hooks/useAsync";
import { useAutomationActions } from "@/hooks/useAutomationActions";
import { cn } from "@/lib/cn";
import { fetchAutomationsFor } from "@/services/automations";
import { AskAgent, type AgentPrompt } from "./AskAgent";
import { RecordsSection } from "./RecordsSection";

type Filter = "all" | "active" | "paused";
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
];

const PROMPTS: AgentPrompt[] = [
  { label: "A morning brief", hint: "Every weekday at 7:00", Icon: Sunrise, task: "Set up a recurring task: every weekday at 7am, brief me on new customers, replies and today's appointments." },
  { label: "A Monday report", hint: "Every Monday at 9:00", Icon: CalendarSync, task: "Set up a recurring task: every Monday at 9am, report last week's campaigns, replies and new customers." },
];

/** Every agent's recurring tasks in one place, grouped by the agent that runs them. */
export function SchedulesView() {
  const { agents, status: agentsStatus, error: agentsError } = useAgents();
  const ids = agents.map((agent) => agent.id).join(",");
  const tasks = useAsync(
    () => (ids ? fetchAutomationsFor(ids.split(",")) : Promise.resolve({ automations: [], failed: [] })),
    [ids],
    "Could not load your schedules",
  );
  const { busy, act, dialogs } = useAutomationActions(tasks.reload);
  const [filter, setFilter] = useState<Filter>("all");

  const groups = useMemo(() => {
    const shown = (tasks.data?.automations ?? []).filter((t) => filter === "all" || t.active === (filter === "active"));
    return agents
      .map((agent) => ({ agent, tasks: shown.filter((t) => t.agentId === agent.id) }))
      .filter((group) => group.tasks.length > 0);
  }, [agents, tasks.data, filter]);

  const loading = agentsStatus === "idle" || agentsStatus === "loading" || tasks.status === "loading";
  const error = agentsStatus === "error" ? agentsError : tasks.status === "error" ? tasks.error : null;
  const total = tasks.data?.automations.length ?? 0;
  const failed = tasks.data?.failed.length ?? 0;

  return (
    <div className="grid gap-10">
      <RecordsSection
        title="Recurring tasks"
        description="Work your agents run on their own. Times are in UTC, as they're stored."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <FilterChips label="Filter schedules" value={filter} items={FILTERS} onChange={setFilter} variant="outline" />
            <Button variant="secondary" onClick={tasks.reload} disabled={tasks.refreshing}
              icon={<RefreshCw className={cn("size-3.5", tasks.refreshing && "animate-spin")} />}>
              Refresh
            </Button>
          </div>
        }
      >
        {failed > 0 && (
          <p className="text-xs text-warn">{failed} agent{failed === 1 ? "'s" : "s'"} schedules couldn&rsquo;t be read. Refresh to try again.</p>
        )}
        {loading ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-28" />)}
          </div>
        ) : error ? (
          <EmptyState tone="bad" icon={<CircleAlert />} title="Couldn't load schedules" description={error}
            action={<Button variant="secondary" onClick={tasks.reload}>Try again</Button>} />
        ) : groups.length === 0 ? (
          <EmptyState icon={<CalendarClock />}
            title={total ? `No ${filter} schedules` : "Nothing scheduled yet"}
            description="Ask an agent for something it should do every day or every week." />
        ) : (
          groups.map(({ agent, tasks: list }) => (
            <div key={agent.id} className="grid gap-3">
              <Link href={`/agents/${agent.id}/workflows`} className="w-fit text-sm font-medium text-muted hover:text-ink">
                {agent.name} <span className="font-mono text-xs text-faint">· {list.length}</span>
              </Link>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {list.map((task) => (
                  <AutomationCard key={task.id} automation={task} busy={busy === task.id} onAction={act} />
                ))}
              </div>
            </div>
          ))
        )}
      </RecordsSection>

      <RecordsSection title="Schedule something new" description="A new agent takes the task and sets the schedule up itself.">
        <AskAgent label="Start a schedule" prompts={PROMPTS} />
      </RecordsSection>
      {dialogs}
    </div>
  );
}
