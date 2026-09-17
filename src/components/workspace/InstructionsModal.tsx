"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import { updateAgent } from "@/lib/agents/actions";
import { extractApiError } from "@/lib/api/errors";
import type { Agent } from "@/types/agent";

/** The agent's name and brief. Chat can also rewrite the brief; this is the manual edit. */
export function InstructionsModal({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const [name, setName] = useState(agent.name);
  const [instructions, setInstructions] = useState(agent.instructions);
  const [saving, setSaving] = useState(false);
  const changed = name.trim() !== agent.name || instructions !== agent.instructions;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !changed) return;
    setSaving(true);
    try {
      await updateAgent(agent.id, { name: name.trim(), instructions });
      toast.success("Instructions saved.");
      onClose();
    } catch (err) {
      toast.error(extractApiError(err, "Could not save the instructions"));
      setSaving(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title="Instructions"
      description="What this agent is for and how it should work. It follows these on every task."
    >
      <form id="instructions-form" onSubmit={onSubmit} className="grid gap-4">
        <TextField id="agent-name" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Field id="agent-instructions" label="Brief" hint="Plain language is fine. Markdown works too.">
          <textarea
            id="agent-instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={12}
            className="w-full resize-y rounded-[10px] border border-line bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink outline-none transition-colors hover:border-faint focus:border-accent focus:ring-3 focus:ring-accent-soft"
            placeholder="e.g. You find local businesses with no website in the cities I name, and draft a short WhatsApp opener for each."
          />
        </Field>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving} disabled={!changed || !name.trim()}>
            Save instructions
          </Button>
        </div>
      </form>
    </Modal>
  );
}
