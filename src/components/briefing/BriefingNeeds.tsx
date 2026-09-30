import { CheckCheck } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { BriefingNeed } from "@/types/briefing";
import { BriefingSection } from "./BriefingSection";
import { NeedCard } from "./NeedCard";

/**
 * The loud section, and the only one. Capped at six by the backend, ranked by
 * what goes wrong if it is left today rather than by what happened most
 * recently.
 *
 * Empty is a success, not a gap: an assistant that finds four urgent things
 * every morning is justifying itself rather than reading the data, so this says
 * so plainly instead of apologising for having nothing.
 */
export function BriefingNeeds({
  needs,
  more,
  onAct,
}: {
  needs: BriefingNeed[];
  more: number;
  onAct: (instruction: string) => void;
}) {
  if (!needs.length) {
    return (
      <BriefingSection title="Needs you" aside="all clear">
        <EmptyState
          icon={<CheckCheck />}
          title="Nothing waiting"
          description="Everything that needed a decision has one. You'll hear from me when that changes."
        />
      </BriefingSection>
    );
  }

  return (
    <BriefingSection title="Needs you" aside={needs.length === 1 ? "1 thing" : `${needs.length} things`}>
      <div className="grid gap-2.5">
        {needs.map((need) => (
          <NeedCard key={need.id} need={need} onAct={onAct} />
        ))}
      </div>
      {more > 0 && (
        // Counted, never listed. A briefing with fourteen urgent items is a
        // list, and a list is what the user was already ignoring.
        <p className="text-xs text-muted">
          {more} more ranked below these. They&apos;re waiting in Records.
        </p>
      )}
    </BriefingSection>
  );
}
