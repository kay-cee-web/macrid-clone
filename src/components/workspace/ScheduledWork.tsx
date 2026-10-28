"use client";

import { CalendarClock, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { useAutomationActions } from "@/hooks/useAutomationActions";
import { SCHEDULE_PROMPT } from "@/lib/automations/schedule";
import { fetchAutomations } from "@/services/automations";
import { AutomationCard } from "./AutomationCard";

type ScheduledWorkProps = {
  agentId: string;
  agentName: string;
  /** Open the chat with a draft to finish. */
  onDraft: (text: string) => void;
};

/**
 * The agent's scheduled tasks, read from `/agents/{id}/automations`. New ones
 * are made in chat; each card runs, pauses, edits or deletes its own.
 */
export function ScheduledWork({ agentId, agentName, onDraft }: ScheduledWorkProps) {
  const tasks = useAsync(() => fetchAutomations(agentId), [agentId], "Could not load the scheduled tasks");
  const { busy, act, dialogs } = useAutomationActions(tasks.reload);
  const list = tasks.data ?? [];

  return (
    <section className="grid gap-4 rounded-[14px] border border-line bg-surface p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent">
          <CalendarClock className="size-5" />
        </span>
        <div className="grid min-w-0 flex-1 gap-0.5">
          <h3 className="font-sans text-base font-semibold tracking-normal">Scheduled tasks</h3>
          <p className="text-sm text-muted">
            Work {agentName} runs on its own, like a Monday report or a morning brief. Ask for a new one in chat.
          </p>
        </div>
        <Button size="sm" variant="secondary" icon={<Plus className="size-3.5" />} onClick={() => onDraft(SCHEDULE_PROMPT)}>
          Schedule a task
        </Button>
      </div>

      {tasks.status === "loading" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : tasks.status === "error" ? (
        <p className="flex flex-wrap items-center gap-2 text-sm text-bad">
          {tasks.error}
          <Button size="sm" variant="ghost" onClick={tasks.reload}>Try again</Button>
        </p>
      ) : list.length === 0 ? (
        <p className="text-sm text-muted">Nothing scheduled yet.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((task) => (
            <AutomationCard key={task.id} automation={{ ...task, agentId }} busy={busy === task.id} onAction={act} />
          ))}
        </div>
      )}
      {dialogs}
    </section>
  );
}
