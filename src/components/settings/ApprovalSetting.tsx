"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/Switch";
import { updateAgent } from "@/lib/agents/actions";
import { hasApprovalRule, withApprovalRule } from "@/lib/agents/approval";
import { extractApiError } from "@/lib/api/errors";
import type { Agent } from "@/types/agent";
import { SettingRow } from "./SettingsSection";

/** Draft first, send on "send". Stored as a rule block in the agent's instructions. */
export function ApprovalSetting({ agent }: { agent: Agent }) {
  const [saving, setSaving] = useState(false);
  const on = hasApprovalRule(agent.instructions);

  async function toggle(next: boolean) {
    setSaving(true);
    try {
      await updateAgent(agent.id, { instructions: withApprovalRule(agent.instructions, next) });
      toast.success(next ? `${agent.name} will ask before sending anything.` : `${agent.name} sends without asking first.`);
    } catch (err) {
      toast.error(extractApiError(err, "Could not change the approval rule"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingRow
      label="Ask before sending"
      htmlFor="approval-switch"
      description={
        on
          ? 'On. The agent shows the draft, the recipients and the checks, then waits for you to reply "send".'
          : "Off. When sending is on, the agent sends as soon as it decides to."
      }
    >
      <Switch
        id="approval-switch"
        label="Ask before sending"
        checked={on}
        disabled={saving}
        onChange={(next) => void toggle(next)}
      />
    </SettingRow>
  );
}
