import Link from "next/link";
import { Zap } from "lucide-react";
import { PLAN_HREF } from "@/lib/plans/plan";

/** Sidebar nudge to Plan and billing, where the licences that grant tokens are redeemed. */
export function UpgradeCard() {
  return (
    <Link
      href={PLAN_HREF}
      className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-float transition-colors hover:bg-raised"
    >
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="text-base font-medium text-ink">Upgrade your plan</span>
        <span className="text-sm text-muted">More tokens for your agents</span>
      </span>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-accent-ink shadow-glow">
        <Zap className="size-4.5 fill-current" />
      </span>
    </Link>
  );
}
