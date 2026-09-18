"use client";

import { useState } from "react";
import { ArrowUpRight, CircleAlert } from "lucide-react";
import { PanelHeading } from "@/components/app/SettingsPanels";
import { Button } from "@/components/ui/Button";
import { PLANS } from "@/data/plans";
import { useAsync } from "@/hooks/useAsync";
import { dexisphereSiteLink } from "@/lib/config";
import { matchPlan, planIndex } from "@/lib/plans/plan";
import { fetchPackage } from "@/services/billing";
import { CurrentPlan } from "./CurrentPlan";
import { PlanCard, type PlanState } from "./PlanCard";
import { PlanComparison } from "./PlanComparison";
import { RedeemModal } from "./RedeemModal";
import { TokenNotes } from "./TokenNotes";

/**
 * Plan and billing.
 *
 * **Every plan is a one-time lifetime licence**, so there is no monthly/yearly
 * toggle to draw and nothing renews. Buying happens at checkout on the pricing
 * site; the code that comes back is redeemed here.
 *
 * The account's own figures come from `GET /package`; the tiers are a static
 * catalogue, because no route lists them. A failed read costs the "your plan"
 * marking and nothing else — the tiers still draw.
 */
export function PlanPanel() {
  const [redeeming, setRedeeming] = useState(false);
  const { data: account, status, error, reload } = useAsync(fetchPackage, [], "Could not load your plan");

  const current = matchPlan(account?.name);
  const currentIndex = planIndex(current);

  const stateOf = (index: number): PlanState => {
    if (current && index === currentIndex) return "current";
    if (currentIndex > -1 && index < currentIndex) return "included";
    return PLANS[index].checkout ? "buy" : "included";
  };

  return (
    <div className="grid gap-6">
      <PanelHeading
        title="Plan and billing"
        description="Lifetime licences, not subscriptions: you pay once, nothing renews and nothing lapses."
      />

      {status === "error" && (
        <p className="flex flex-wrap items-center gap-2 rounded-[12px] border border-line bg-raised/60 p-3 text-sm text-muted">
          <CircleAlert className="size-4 shrink-0 text-warn" />
          {error} — the tiers below are still what&apos;s for sale.
          <Button variant="ghost" size="sm" onClick={reload} className="ml-auto">
            Try again
          </Button>
        </p>
      )}

      <CurrentPlan account={account} plan={current} status={status} onRedeem={() => setRedeeming(true)} />

      <section className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full bg-raised p-1 text-xs">
            <span className="rounded-full bg-surface px-3 py-1.5 font-medium text-ink shadow-float">Lifetime</span>
            <span className="px-3 py-1.5 text-muted">One-time payment</span>
          </div>
          <a
            href={dexisphereSiteLink("/pricing")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            See full pricing
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        {/* A rail rather than a grid: four cards fit most windows, and a narrow one scrolls. */}
        <div className="-mx-1 flex snap-x items-stretch gap-4 overflow-x-auto px-1 pb-2">
          {PLANS.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} previous={PLANS[index - 1]} state={stateOf(index)} />
          ))}
        </div>

        <PlanComparison current={current} />
        <p className="text-xs text-faint">
          Tier details follow dexisphere.com. The allowances above are your account&apos;s own — where the two
          disagree, your account is right.
        </p>
      </section>

      <TokenNotes />

      {redeeming && <RedeemModal onClose={() => setRedeeming(false)} onRedeemed={reload} />}
    </div>
  );
}
