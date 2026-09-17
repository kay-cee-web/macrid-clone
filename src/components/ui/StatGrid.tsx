import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Skeleton } from "./Skeleton";

export type Stat = {
  label: string;
  /** Already formatted: "1,284", "12.9K", "38%". Empty shows a dash. */
  value: string;
  /** Short context under the value, e.g. "of 1,204 sent". */
  note?: string;
  /** Percent change vs the previous period; up is good unless `downIsGood`. */
  change?: number | null;
  downIsGood?: boolean;
};

const percent = new Intl.NumberFormat("en", { maximumFractionDigits: 1, signDisplay: "exceptZero" });

function Change({ change, downIsGood }: { change: number; downIsGood?: boolean }) {
  const up = change > 0;
  const good = change === 0 ? null : up !== Boolean(downIsGood);
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn("inline-flex items-center gap-0.5 font-mono text-xs", good === null ? "text-muted" : good ? "text-good" : "text-bad")}>
      {change !== 0 && <Icon aria-hidden className="size-3" />}
      {percent.format(change)}%<span className="sr-only"> vs the previous period</span>
    </span>
  );
}

/** A row of stat tiles separated by hairlines. `stats === null` shows skeletons. */
export function StatGrid({ stats, skeletons = 4, className }: { stats: Stat[] | null; skeletons?: number; className?: string }) {
  const tiles = stats ?? Array.from({ length: skeletons }, () => null);
  return (
    <dl className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-line bg-line lg:grid-cols-4", className)}>
      {tiles.map((stat, index) => (
        <div key={stat?.label ?? index} className="grid content-start gap-1.5 bg-surface p-4">
          {stat ? (
            <>
              <dt className="text-xs text-muted">{stat.label}</dt>
              <dd className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-sans text-2xl font-semibold leading-none tabular-nums text-ink">{stat.value || "—"}</span>
                {typeof stat.change === "number" && <Change change={stat.change} downIsGood={stat.downIsGood} />}
              </dd>
              {stat.note && <dd className="text-xs text-faint">{stat.note}</dd>}
            </>
          ) : (
            <>
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-7 w-16" />
            </>
          )}
        </div>
      ))}
    </dl>
  );
}
