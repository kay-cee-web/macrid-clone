import { ArrowUpRight, Check, Plus } from "lucide-react";
import { Pill } from "@/components/ui/Pill";
import { buttonStyles } from "@/components/ui/button-styles";
import { CARD_FEATURES } from "@/data/plans";
import { cn } from "@/lib/cn";
import { formatAllowance } from "@/lib/plans/plan";
import type { Plan } from "@/types/plan";

/** current = the account's own tier; included = below it, already covered; buy = an upgrade. */
export type PlanState = "current" | "included" | "buy";

/**
 * One tier. "Everything in X" is only truthful because `PLANS` is a strict
 * ladder — a tier that isn't a superset of the one below would have to list
 * its features in full.
 */
export function PlanCard({ plan, previous, state }: { plan: Plan; previous?: Plan; state: PlanState }) {
  return (
    <article
      className={cn(
        "flex w-68 shrink-0 snap-start flex-col overflow-hidden rounded-[14px] border bg-surface",
        state === "current" ? "border-accent ring-1 ring-accent" : "border-line",
      )}
    >
      <div className="grid gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-ink">{plan.name}</h3>
          {plan.popular && <Pill tone="accent">Popular</Pill>}
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-3xl font-semibold leading-none tracking-tight text-ink">
            {plan.price === 0 ? "Free" : `$${plan.price}`}
          </span>
          {plan.price > 0 && <span className="text-sm text-muted">once</span>}
        </div>

        <p className="text-xs text-faint">
          {plan.price > 0 ? "One-time payment · lifetime licence" : "No card needed"}
        </p>

        {state === "current" ? (
          <p className="flex items-center justify-center gap-1.5 rounded-[10px] border border-accent py-2.5 text-sm font-medium text-accent">
            <Check className="size-4" /> Your plan
          </p>
        ) : state === "included" ? (
          /* A tier below yours isn't a purchase — your licence already covers it. */
          <p className="rounded-[10px] border border-line py-2.5 text-center text-sm text-muted">Included</p>
        ) : (
          <a
            href={plan.checkout}
            target="_blank"
            rel="noreferrer"
            className={buttonStyles({ variant: plan.popular ? "primary" : "secondary", block: true })}
          >
            Buy {plan.name}
            <ArrowUpRight className="size-3.5" />
          </a>
        )}
      </div>

      <ul className="grid flex-1 content-start gap-2.5 border-t border-line bg-raised/60 p-5">
        {CARD_FEATURES.map(({ key, phrase }) => (
          <li key={key} className="flex items-start gap-2.5 text-sm text-ink">
            <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-accent" />
            <span>
              <span className="font-mono text-xs">{formatAllowance(plan[key])}</span> {phrase}
            </span>
          </li>
        ))}
        {plan.remove_branding && (
          <li className="flex items-start gap-2.5 text-sm text-ink">
            <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-accent" />
            Remove branding
          </li>
        )}
        {previous && (
          <li className="flex items-center gap-2.5 text-sm text-muted">
            <Plus aria-hidden className="size-3.5 shrink-0" />
            Everything in {previous.name}
          </li>
        )}
      </ul>
    </article>
  );
}
