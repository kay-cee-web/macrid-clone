import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatGrid, type Stat } from "@/components/ui/StatGrid";

type AnalyticsSectionProps = {
  title: string;
  icon: ReactNode;
  /** null while loading. */
  stats: Stat[] | null;
  error: string | null;
  onRetry: () => void;
  children?: ReactNode;
};

/** One channel's KPI row, with its own error so one failed read doesn't hide the rest. */
export function AnalyticsSection({ title, icon, stats, error, onRetry, children }: AnalyticsSectionProps) {
  return (
    <section className="grid gap-3">
      <h2 className="flex items-center gap-2 text-[17px] font-semibold [&_svg]:size-4 [&_svg]:text-muted">
        {icon}
        {title}
      </h2>
      {error && !stats ? (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-[12px] bg-bad-soft px-4 py-3 text-[13.5px] text-bad">
          <CircleAlert className="size-4 shrink-0" />
          <span className="min-w-0 flex-1">{error}</span>
          <Button size="sm" variant="secondary" onClick={onRetry}>Try again</Button>
        </div>
      ) : (
        <StatGrid stats={stats} />
      )}
      {children}
    </section>
  );
}
