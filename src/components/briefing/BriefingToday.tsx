import { Button } from "@/components/ui/Button";
import { todayDoneInstruction } from "@/lib/briefing/instructions";
import type { BriefingToday as TodayItem } from "@/types/briefing";
import { BriefingSection } from "./BriefingSection";

/**
 * The day's schedule: appointments, tasks due and campaigns going out.
 *
 * Deliberately rows against a time column rather than cards — it is what is
 * already arranged, not a list of decisions, and giving it cards would make it
 * compete with "Needs you" for the same attention.
 */
export function BriefingToday({ today, onAct }: { today: TodayItem[]; onAct: (instruction: string) => void }) {
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
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{item.what}</p>
              {item.sub && <p className="text-xs text-muted">{item.sub}</p>}
            </div>
            {/* These rows carry no id, so the agent finds it by name and says what it changed. */}
            <Button variant="ghost" size="sm" onClick={() => onAct(todayDoneInstruction(item))}>
              Done
            </Button>
          </div>
        ))}
      </div>
    </BriefingSection>
  );
}
