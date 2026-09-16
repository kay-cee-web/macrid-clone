import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Card";

export type ReceiptStat = { label: string; value: number | string };

type WorkReceiptProps = {
  /** The Macrid area the work happened in, e.g. "Prospect Finder". */
  area: string;
  stats: ReceiptStat[];
  badge?: ReactNode;
  /** Detail below the stats, e.g. one line per change. */
  children?: ReactNode;
  className?: string;
};

/** Signature element: what an agent did, where, and how much. */
export function WorkReceipt({ area, stats, badge, children, className }: WorkReceiptProps) {
  return (
    <div className={cn("overflow-hidden rounded-[12px] border border-line bg-surface", className)}>
      <header className="flex items-center gap-2 border-b border-dashed border-line px-3 py-2">
        <Eyebrow>{area}</Eyebrow>
        {badge && <span className="ml-auto">{badge}</span>}
      </header>
      <dl
        className="grid divide-x divide-line"
        style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="px-3 py-2.5">
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted">{stat.label}</dt>
            <dd className="mt-1.5 font-display text-[20px] font-semibold leading-none tabular-nums">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      {children && <div className="border-t border-dashed border-line">{children}</div>}
    </div>
  );
}
