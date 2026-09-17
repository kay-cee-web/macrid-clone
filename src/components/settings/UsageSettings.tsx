"use client";

import { CircleAlert, History } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useWorkspace } from "@/components/workspace/WorkspaceContext";
import { useAsync } from "@/hooks/useAsync";
import { timeAgo } from "@/lib/format";
import { fetchAgent, fetchAgentActions } from "@/services/agents";
import { SettingsSection } from "./SettingsSection";

export function UsageSettings() {
  const { agent } = useWorkspace();
  const stats = useAsync(() => fetchAgent(agent.id).then((r) => r.stats), [agent.id], "Could not load activity");
  const actions = useAsync(() => fetchAgentActions(agent.id), [agent.id], "Could not load the activity log");

  const tiles = stats.data
    ? [
        { label: "Messages", value: stats.data.messages },
        { label: "Actions taken", value: stats.data.actionsTotal },
        { label: "Sent · 24h", value: stats.data.sentLast24h },
        { label: "Blocked · 24h", value: stats.data.blockedLast24h },
      ]
    : [];

  return (
    <div className="grid gap-8">
      <section className="grid gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold">Activity</h2>
          {stats.data && (
            <span className="text-sm text-muted">
              Last action {stats.data.lastActionAt ? timeAgo(stats.data.lastActionAt) : "never"}
            </span>
          )}
        </div>
        {stats.status === "error" && !stats.data ? (
          <EmptyState
            tone="bad"
            icon={<CircleAlert />}
            title="Couldn't load activity"
            description={stats.error}
            action={<Button variant="secondary" onClick={stats.reload}>Try again</Button>}
          />
        ) : (
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-line bg-line lg:grid-cols-4">
            {(tiles.length ? tiles : Array.from({ length: 4 }, (_, i) => ({ label: `…${i}`, value: null }))).map((tile) => (
              <div key={tile.label} className="grid gap-2 bg-surface p-4">
                <dt className="font-mono text-xs uppercase tracking-[0.06em] text-muted">
                  {tile.value === null ? <Skeleton className="h-3 w-16" /> : tile.label}
                </dt>
                <dd className="font-display text-3xl font-semibold leading-none tabular-nums">
                  {tile.value === null ? <Skeleton className="h-7 w-12" /> : tile.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <SettingsSection title="Activity log" description="What this agent has done in Dexisphere: sends, updates and anything it was blocked from.">
        {actions.status === "loading" ? (
          <div className="grid gap-2 p-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : actions.status === "error" ? (
          <p className="p-4 text-sm text-bad">{actions.error}</p>
        ) : !actions.data?.length ? (
          <EmptyState
            className="m-4 border-none py-8"
            icon={<History />}
            title="Nothing logged yet"
            description="When the agent sends, updates or is blocked from something, it shows up here."
          />
        ) : (
          actions.data.map((row, index) => (
            <pre key={index} className="overflow-x-auto p-4 font-mono text-xs text-muted">
              {JSON.stringify(row, null, 2)}
            </pre>
          ))
        )}
      </SettingsSection>
    </div>
  );
}
