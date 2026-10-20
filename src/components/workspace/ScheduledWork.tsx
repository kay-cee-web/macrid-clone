"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { extractApiError } from "@/lib/api/errors";
import { deleteAutomation, fetchAutomations, runAutomation, updateAutomation } from "@/services/automations";
import type { Automation } from "@/types/automation";
import { AutomationCard, type AutomationAction } from "./AutomationCard";
import { AutomationEditModal } from "./AutomationEditModal";

/** What "Schedule a task" drafts in the chat: the agent sets the schedule up with its own tool. */
const SCHEDULE_PROMPT = "Set up a recurring task: ";

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
  const router = useRouter();
  const tasks = useAsync(() => fetchAutomations(agentId), [agentId], "Could not load the scheduled tasks");
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState<Automation | null>(null);
  const [deleting, setDeleting] = useState<Automation | null>(null);

  async function act(action: AutomationAction, task: Automation) {
    if (action === "edit") return setEditing(task);
    if (action === "delete") return setDeleting(task);
    setBusy(task.id);
    try {
      if (action === "run") {
        const running = toast.loading(`Running ${task.name}…`);
        await runAutomation(agentId, task.id).finally(() => toast.dismiss(running));
        toast.success(`${task.name} ran. The result is in the chat.`, {
          action: { label: "Open chat", onClick: () => router.push(`/agents/${agentId}`) },
        });
      } else {
        await updateAutomation(agentId, task.id, { is_active: !task.active });
        toast.success(task.active ? `${task.name} is paused.` : `${task.name} is running again.`);
      }
      tasks.reload();
    } catch (err) {
      toast.error(extractApiError(err, action === "run" ? "Could not run that task" : "Could not update that task"));
    } finally {
      setBusy(null);
    }
  }

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
            <AutomationCard key={task.id} automation={task} busy={busy === task.id} onAction={(a, t) => void act(a, t)} />
          ))}
        </div>
      )}

      {editing && (
        <AutomationEditModal
          automation={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            tasks.reload();
          }}
        />
      )}
      {deleting && (
        <ConfirmModal
          title={`Delete ${deleting.name}?`}
          description="It stops running and can't be brought back. Ask the agent to set it up again if you need it later."
          confirmLabel="Delete"
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            try {
              await deleteAutomation(agentId, deleting.id);
              toast.success(`${deleting.name} deleted.`);
              tasks.reload();
              return true;
            } catch (err) {
              toast.error(extractApiError(err, "Could not delete that task"));
              return false;
            }
          }}
        />
      )}
    </section>
  );
}
