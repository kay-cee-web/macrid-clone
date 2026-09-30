import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import {
  askInstruction,
  canChange,
  canDraft,
  draftInstruction,
  handledInstruction,
  notTodayInstruction,
} from "@/lib/briefing/instructions";
import type { BriefingNeed } from "@/types/briefing";

/**
 * One thing that needs the user today.
 *
 * The coloured left edge is the only one in the briefing: `Today` and `Worth
 * knowing` stay quiet so this reads as the urgent section at a glance. The
 * source is a neutral pill rather than a colour per vendor — a coloured badge
 * beside an urgent item reads as severity, and provenance is not severity.
 *
 * Every button hands a sentence to the agent and opens the chat on it, so the
 * user sees the work happen and can stop it. Nothing here changes a record
 * behind their back, and a card the agent can't act on says so by offering
 * only a question (see `canChange`).
 */
export function NeedCard({ need, onAct }: { need: BriefingNeed; onAct: (instruction: string) => void }) {
  const actionable = canChange(need);

  return (
    <article className="grid gap-2 rounded-[14px] border border-line border-l-2 border-l-bad bg-surface p-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {need.source && <Pill>{need.source}</Pill>}
        {/* Why it is here *today*. Never dropped — without it the user has to work out the urgency themselves. */}
        {need.why && <span className="text-xs text-muted">{need.why}</span>}
      </div>

      <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-ink">{need.title}</h3>
      {need.body && <p className="text-sm leading-relaxed text-muted">{need.body}</p>}

      <div className="mt-1 flex flex-wrap gap-2">
        {canDraft(need) && (
          <Button size="sm" onClick={() => onAct(draftInstruction(need))}>
            Draft a reply
          </Button>
        )}
        {actionable ? (
          <>
            <Button variant="secondary" size="sm" onClick={() => onAct(handledInstruction(need))}>
              Handled
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onAct(notTodayInstruction(need))}>
              Not today
            </Button>
          </>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => onAct(askInstruction(need))}>
            Ask about this
          </Button>
        )}
      </div>
    </article>
  );
}
