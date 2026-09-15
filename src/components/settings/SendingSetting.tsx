"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/Switch";
import { useAsync } from "@/hooks/useAsync";
import { setSending } from "@/lib/agents/actions";
import { extractApiError } from "@/lib/api/errors";
import { fetchAgent } from "@/services/agents";
import type { Agent } from "@/types/agent";
import { SettingRow } from "./SettingsSection";

/** The kill switch, shown with its receipt: what was sent or blocked in the last day. */
export function SendingSetting({ agent }: { agent: Agent }) {
  const [saving, setSaving] = useState(false);
  const stats = useAsync(() => fetchAgent(agent.id).then((r) => r.stats), [agent.id]);

  async function toggle(enabled: boolean) {
    setSaving(true);
    try {
      const { message } = await setSending(agent.id, enabled);
      toast.success(message || (enabled ? "Sending is on." : "Sending is off."));
      stats.reload();
    } catch (err) {
      toast.error(extractApiError(err, "Could not change sending"));
    } finally {
      setSaving(false);
    }
  }

  const counts = stats.data
    ? `${stats.data.sentLast24h} sent · ${stats.data.blockedLast24h} blocked in the last 24 hours`
    : stats.status === "error"
      ? "Activity counts are unavailable right now."
      : "Loading activity…";

  return (
    <SettingRow
      label="Sending"
      htmlFor="sending-switch"
      description={
        <div className="grid gap-1">
          <span>
            {agent.sendingEnabled
              ? "On. The agent can send messages and campaigns for you."
              : "Off. The agent still researches and drafts, but nothing leaves Macrid."}
          </span>
          <span className="font-mono text-[12px] text-faint tabular-nums">{counts}</span>
        </div>
      }
    >
      <Switch
        id="sending-switch"
        label="Allow this agent to send"
        checked={agent.sendingEnabled}
        disabled={saving}
        onChange={(enabled) => void toggle(enabled)}
      />
    </SettingRow>
  );
}
