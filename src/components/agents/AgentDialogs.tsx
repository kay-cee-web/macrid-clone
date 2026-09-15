"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import { deleteAgent, updateAgent } from "@/lib/agents/actions";
import { extractApiError } from "@/lib/api/errors";
import type { Agent } from "@/types/agent";
import type { AgentDialog } from "./AgentActionsMenu";

/** Rename and delete dialogs, mounted once per page. */
export function AgentDialogs({ dialog, onClose }: { dialog: AgentDialog; onClose: () => void }) {
  return (
    <>
      {dialog?.type === "rename" && <RenameDialog key={dialog.agent.id} agent={dialog.agent} onClose={onClose} />}
      {dialog?.type === "delete" && <DeleteDialog key={dialog.agent.id} agent={dialog.agent} onClose={onClose} />}
    </>
  );
}

function RenameDialog({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const [name, setName] = useState(agent.name);
  const [saving, setSaving] = useState(false);
  const trimmed = name.trim();
  const unchanged = trimmed === agent.name;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!trimmed || unchanged) return;
    setSaving(true);
    try {
      await updateAgent(agent.id, { name: trimmed });
      toast.success(`Renamed to ${trimmed}.`);
      onClose();
    } catch (err) {
      toast.error(extractApiError(err, "Could not rename the agent"));
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title="Rename agent" size="sm">
      <form onSubmit={onSubmit} className="grid gap-4">
        <TextField id="agent-name" label="Name" value={name} autoFocus onChange={(e) => setName(e.target.value)} />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving} disabled={!trimmed || unchanged}>
            Save name
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteDialog({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const router = useRouter();

  async function confirm() {
    try {
      await deleteAgent(agent.id);
      toast.success(`Deleted ${agent.name}.`);
      if (window.location.pathname.startsWith(`/agents/${agent.id}`)) router.replace("/agents/all");
      return true;
    } catch (err) {
      toast.error(extractApiError(err, "Could not delete the agent"));
      return false;
    }
  }

  return (
    <ConfirmModal
      title={`Delete ${agent.name}?`}
      description="This permanently removes the agent, its instructions and its conversation. Linked channels stop working."
      cancelLabel="Keep agent"
      confirmLabel="Delete agent"
      onConfirm={confirm}
      onClose={onClose}
    />
  );
}
