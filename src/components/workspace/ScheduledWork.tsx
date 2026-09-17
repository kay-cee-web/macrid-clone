"use client";

import { CalendarClock, ListChecks, PauseCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** What each shortcut sends (or drafts) in the chat. The agent has the automation tools. */
const SCHEDULE_PROMPTS = {
  list: "List every automation you have scheduled for me. For each one: what it does, how often it runs, when it runs next, and its ID.",
  create: "Set up a recurring task: ",
  cancel: "Cancel the scheduled automation with ID ",
};

type ScheduledWorkProps = {
  agentName: string;
  /** Send straight away. */
  onSend: (text: string) => void;
  /** Open the chat with a draft to finish. */
  onDraft: (text: string) => void;
};

/**
 * Recurring work runs on the server (schedule_automation). There is no route
 * to list automations from the client, so the agent is asked instead.
 */
export function ScheduledWork({ agentName, onSend, onDraft }: ScheduledWorkProps) {
  return (
    <section className="flex flex-col gap-4 rounded-[14px] border border-line bg-surface p-4 sm:flex-row sm:items-center">
      <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent">
        <CalendarClock className="size-5" />
      </span>
      <div className="grid min-w-0 flex-1 gap-0.5">
        <h3 className="font-sans text-base font-semibold tracking-normal">Scheduled work</h3>
        <p className="text-sm text-muted">
          {agentName} can run tasks on a schedule, like a Monday report or daily reminders. Ask it what&apos;s running,
          add a new one, or stop one.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" icon={<ListChecks className="size-3.5" />} onClick={() => onSend(SCHEDULE_PROMPTS.list)}>
          Show scheduled
        </Button>
        <Button size="sm" variant="secondary" icon={<Plus className="size-3.5" />} onClick={() => onDraft(SCHEDULE_PROMPTS.create)}>
          Schedule a task
        </Button>
        <Button size="sm" variant="ghost" icon={<PauseCircle className="size-3.5" />} onClick={() => onDraft(SCHEDULE_PROMPTS.cancel)}>
          Stop one
        </Button>
      </div>
    </section>
  );
}
