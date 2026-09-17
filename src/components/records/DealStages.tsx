import { Skeleton } from "@/components/ui/Skeleton";
import { formatAmount } from "@/lib/format";
import { DEAL_STAGES } from "@/lib/records/status";
import type { Deal } from "@/types/records";

/** Count and value per pipeline stage, as one hairline strip. */
export function DealStages({ deals }: { deals: Deal[] | null }) {
  const stages = DEAL_STAGES.map((stage) => {
    const inStage = deals?.filter((deal) => deal.stage.toLowerCase() === stage.toLowerCase()) ?? [];
    const value = inStage.reduce((sum, deal) => sum + (deal.amount ?? 0), 0);
    return { stage, count: inStage.length, value };
  });

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
      {stages.map(({ stage, count, value }) => (
        <div key={stage} className="grid gap-1.5 bg-surface p-3.5">
          <dt className="truncate font-mono text-xs uppercase tracking-[0.06em] text-muted">{stage}</dt>
          <dd className="grid gap-0.5">
            {deals ? (
              <>
                <span className="font-display text-2xl font-semibold leading-none tabular-nums">{count}</span>
                <span className="font-mono text-xs text-muted tabular-nums">{formatAmount(value)}</span>
              </>
            ) : (
              <Skeleton className="h-6 w-10" />
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
