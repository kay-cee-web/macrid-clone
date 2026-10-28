"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AutomationAction } from "@/components/workspace/AutomationCard";
import { AutomationEditModal } from "@/components/workspace/AutomationEditModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { extractApiError } from "@/lib/api/errors";
import { deleteAutomation, runAutomation, updateAutomation } from "@/services/automations";
import type { Automation } from "@/types/automation";

/**
 * Run, pause, edit and delete for `AutomationCard`s, wherever they're listed.
 * Each task carries its own `agentId`, so one page can hold several agents' tasks.
 * Render `dialogs` once; `onChanged` re-reads the list after every change.
 */
export function useAutomationActions(onChanged: () => void) {
  const router = useRouter();
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
        await runAutomation(task.agentId, task.id).finally(() => toast.dismiss(running));
        toast.success(`${task.name} ran. The result is in the chat.`, {
          action: { label: "Open chat", onClick: () => router.push(`/agents/${task.agentId}`) },
        });
      } else {
        await updateAutomation(task.agentId, task.id, { is_active: !task.active });
        toast.success(task.active ? `${task.name} is paused.` : `${task.name} is running again.`);
      }
      onChanged();
    } catch (err) {
      toast.error(extractApiError(err, action === "run" ? "Could not run that task" : "Could not update that task"));
    } finally {
      setBusy(null);
    }
  }

  const dialogs = (
    <>
      {editing && (
        <AutomationEditModal
          automation={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            onChanged();
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
              await deleteAutomation(deleting.agentId, deleting.id);
              toast.success(`${deleting.name} deleted.`);
              onChanged();
              return true;
            } catch (err) {
              toast.error(extractApiError(err, "Could not delete that task"));
              return false;
            }
          }}
        />
      )}
    </>
  );

  return { busy, act: (action: AutomationAction, task: Automation) => void act(action, task), dialogs };
}
