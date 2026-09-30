import type { BriefingToday as TodayItem } from "@/types/briefing";
import { BriefingSection } from "./BriefingSection";

/**
 * The day's schedule: appointments, tasks due and campaigns going out.
 *
 * Deliberately rows against a time column rather than cards — it is a list of
 * what is already arranged, not a list of decisions, and giving it cards would
 * make it compete with "Needs you" for the same attention.
 */
export function BriefingToday({ today }: { today: TodayItem[] }) {
  if (!today.length) return null;

  return (
    <BriefingSection title="Today">
      <div className="border-t border-line">
        {today.map((item, index) => (
          <div
            key={`${item.time}:${item.what}:${index}`}
            className="flex flex-col gap-0.5 border-b border-line py-3 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <time className="font-mono text-xs tabular-nums text-muted sm:w-16 sm:shrink-0">
              {item.time || "—"}
            </time>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">{item.what}</p>
              {item.sub && <p className="text-xs text-muted">{item.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </BriefingSection>
  );
}
