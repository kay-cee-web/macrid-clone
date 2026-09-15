"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Select } from "@/components/ui/Select";
import { useWorkspace } from "@/components/workspace/WorkspaceContext";
import { MODEL_GROUPS, isKnownModel, modelName } from "@/data/models";
import { useClipboard } from "@/hooks/useClipboard";
import { cloneAgent, updateAgent } from "@/lib/agents/actions";
import { extractApiError } from "@/lib/api/errors";
import { SendingSetting } from "./SendingSetting";
import { SettingRow, SettingsSection } from "./SettingsSection";

export function GeneralSettings() {
  const { agent, openInstructions, openDialog } = useWorkspace();
  const { copied, copy } = useClipboard();
  const [savingModel, setSavingModel] = useState(false);
  const [cloning, setCloning] = useState(false);

  async function changeModel(value: string) {
    setSavingModel(true);
    try {
      await updateAgent(agent.id, { model: value || null });
      toast.success(value ? `${agent.name} now runs on ${modelName(value)}.` : "Using the workspace default model.");
    } catch (err) {
      toast.error(extractApiError(err, "Could not change the model"));
    } finally {
      setSavingModel(false);
    }
  }

  async function clone() {
    setCloning(true);
    try {
      const copyOf = await cloneAgent(agent);
      toast.success(`Created ${copyOf.name}.`);
    } catch (err) {
      toast.error(extractApiError(err, "Could not clone the agent"));
    } finally {
      setCloning(false);
    }
  }

  return (
    <div className="grid gap-8">
      <SettingsSection title="Behaviour">
        <SendingSetting agent={agent} />
        <SettingRow label="Model" htmlFor="agent-model" description="The AI model this agent thinks with.">
          <Select
            id="agent-model"
            className="w-full sm:w-64"
            value={agent.model ?? ""}
            disabled={savingModel}
            onChange={(event) => void changeModel(event.target.value)}
          >
            <option value="">Workspace default</option>
            {agent.model && !isKnownModel(agent.model) && <option value={agent.model}>{agent.model}</option>}
            {MODEL_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} · {model.note}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </SettingRow>
        <SettingRow label="Instructions" description="The name and brief the agent follows on every task.">
          <Button variant="secondary" onClick={openInstructions}>
            Edit instructions
          </Button>
        </SettingRow>
      </SettingsSection>

      <SettingsSection title="Details">
        <SettingRow label="Agent ID" description="Use it when contacting support or connecting other tools.">
          <code className="rounded-md bg-raised px-2 py-1 font-mono text-[13px] ring-1 ring-inset ring-line">{agent.id}</code>
          <IconButton label={copied ? "Copied" : "Copy agent ID"} onClick={() => void copy(agent.id)}>
            {copied ? <Check className="text-good" /> : <Copy />}
          </IconButton>
        </SettingRow>
      </SettingsSection>

      <SettingsSection title="Manage">
        <SettingRow label="Clone agent" description="Make a copy with the same instructions and model.">
          <Button variant="secondary" loading={cloning} onClick={() => void clone()}>
            Clone
          </Button>
        </SettingRow>
        <SettingRow label="Delete agent" description="Permanently removes the agent, its conversation and its channel links.">
          <Button variant="danger" onClick={() => openDialog({ type: "delete", agent })}>
            Delete agent
          </Button>
        </SettingRow>
      </SettingsSection>
    </div>
  );
}
