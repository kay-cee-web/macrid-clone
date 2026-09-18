import { Check, ChevronDown, Minus } from "lucide-react";
import { COMPARISON_GROUPS, PLANS } from "@/data/plans";
import { formatAllowance, labelOf } from "@/lib/plans/plan";
import type { Allowance, Plan, PlanFeatureKey } from "@/types/plan";

/** A check, a dash for anything switched off, the figure otherwise. */
function Cell({ value }: { value: Allowance }) {
  if (value === true) return <Check aria-label="Included" className="mx-auto size-4 text-accent" />;
  if (value === false || value === 0) return <Minus aria-label="Not included" className="mx-auto size-4 text-faint" />;
  return <span className="font-mono text-xs tabular-nums text-ink">{formatAllowance(value)}</span>;
}

/** Closed by default: the cards carry the headline numbers, this is the full list. */
export function PlanComparison({ current }: { current: Plan | null }) {
  return (
    <details className="group overflow-hidden rounded-[14px] border border-line bg-surface">
      <summary className="flex items-center justify-between gap-3 p-4 text-sm font-medium text-ink">
        Compare every allowance
        <ChevronDown aria-hidden className="size-4 text-muted transition-transform group-open:rotate-180" />
      </summary>

      <div className="overflow-x-auto border-t border-line">
        <table className="w-full min-w-140 border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="p-3 text-left font-medium text-muted">
                Allowance
              </th>
              {PLANS.map((plan) => (
                <th key={plan.id} scope="col" className="p-3 text-center font-medium text-ink">
                  {plan.name}
                  {current?.id === plan.id && <span className="block text-xs font-normal text-accent">Your plan</span>}
                </th>
              ))}
            </tr>
          </thead>
          {COMPARISON_GROUPS.map((group) => (
            <tbody key={group.title} className="border-b border-line last:border-0">
              <tr>
                <th scope="colgroup" colSpan={PLANS.length + 1} className="bg-raised/60 px-3 py-2 text-left text-xs font-medium text-muted">
                  {group.title}
                </th>
              </tr>
              {group.keys.map((key: PlanFeatureKey) => (
                <tr key={key} className="border-t border-line/60">
                  <th scope="row" className="p-3 text-left font-normal text-muted">
                    {labelOf(key)}
                  </th>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="p-3 text-center">
                      <Cell value={plan[key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </details>
  );
}
