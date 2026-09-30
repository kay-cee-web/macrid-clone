"use client";

import { RefreshCw } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { timeAgo } from "@/lib/format";
import { fetchBriefing } from "@/services/briefing";
import { BriefingKnow } from "./BriefingKnow";
import { BriefingNeeds } from "./BriefingNeeds";
import { BriefingPulse } from "./BriefingPulse";
import { BriefingToday } from "./BriefingToday";

/**
 * "For you" — what needs the user today, or that nothing does.
 *
 * Read-only on purpose. Everything here is gathered and ranked server-side in
 * plain SQL, so the numbers are the account's own and none of them can be
 * invented. The actions the prototype drew (draft a reply, handled, snooze)
 * have no routes yet and are deliberately absent rather than stubbed: a button
 * that looks like it works and doesn't costs exactly the trust this screen
 * exists to earn.
 */
export function BriefingView({
  onAct,
  showGreeting = false,
}: {
  /** Hands one sentence to the agent. The caller decides which agent and where it lands. */
  onAct: (instruction: string) => void;
  showGreeting?: boolean;
}) {
  const { data, status, error, refreshing, reload } = useAsync(() => fetchBriefing(), [], "Could not load your briefing");

  if (status === "error") {
    return (
      <div className="grid gap-3">
        <Alert>{error}</Alert>
        <div>
          <Button variant="secondary" size="sm" onClick={reload}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (status === "loading" || !data) {
    return (
      <div className="grid gap-6">
        <BriefingPulse pulse={null} />
        <div className="grid gap-2.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-24 w-full rounded-[14px]" />
          <Skeleton className="h-24 w-full rounded-[14px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {showGreeting && data.greeting && (
        <h1 className="text-2xl font-semibold tracking-tight">{data.greeting}</h1>
      )}

      <BriefingPulse pulse={data.pulse} />

      <BriefingNeeds needs={data.needs} more={data.needsMore} onAct={onAct} />
      <BriefingToday today={data.today} onAct={onAct} />
      <BriefingKnow know={data.know} />

      <div className="flex items-center gap-3 text-xs text-muted">
        {/* The read is cached for an hour, so saying when it was gathered is not a detail. */}
        {data.builtAt && <span>Gathered {timeAgo(data.builtAt)}</span>}
        <Button
          variant="ghost"
          size="sm"
          onClick={reload}
          disabled={refreshing}
          icon={<RefreshCw className={refreshing ? "size-3.5 animate-spin" : "size-3.5"} />}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
