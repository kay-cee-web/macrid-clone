"use client";

import { Button } from "@/components/ui/Button";
import { Meter } from "@/components/ui/Meter";
import { StatGrid } from "@/components/ui/StatGrid";
import { SUMMARY_KEYS } from "@/data/plans";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { allowanceOf, formatAllowance, labelOf } from "@/lib/plans/plan";
import type { AccountPlan, Plan } from "@/types/plan";

/**
 * What this account is on, and what it includes.
 *
 * **Allowances, not usage.** `/package` reports what the plan grants and no
 * route anywhere reports consumption, so nothing here claims a spend. The one
 * real figure we do have is the token balance carried back by the last chat
 * reply, and it only draws a meter while it fits inside the plan's allowance —
 * an account topped up beyond its tier gets the number without a bar rather
 * than a bar pinned at full.
 */
export function CurrentPlan({
  account,
  plan,
  status,
  onRedeem,
}: {
  account: AccountPlan | null;
  plan: Plan | null;
  status: "loading" | "ready" | "error";
  onRedeem: () => void;
}) {
  const balance = useTokenBalance();
  const tokens = allowanceOf(account, plan, "num_tokens");
  const allowance = typeof tokens === "number" ? tokens : null;

  return (
    <div className="grid gap-4 rounded-[14px] border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-0.5">
          <p className="text-sm text-muted">You&apos;re on</p>
          <p className="text-lg font-semibold text-ink">
            {status === "loading"
              ? "Loading your plan…"
              : /* Never guess a tier from a failed read — a wrong plan name here is a billing claim. */
                status === "error"
                ? "Plan unavailable"
                : account?.name || plan?.name || "the Free plan"}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={onRedeem}>
          Redeem a code
        </Button>
      </div>

      <StatGrid
        stats={
          status === "loading"
            ? null
            : SUMMARY_KEYS.map((key) => ({
                label: labelOf(key),
                value: formatAllowance(allowanceOf(account, plan, key)),
                note: key === "num_tokens" && balance !== null ? `${balance.toLocaleString("en")} left` : undefined,
              }))
        }
      />

      {balance !== null && allowance !== null && balance <= allowance && (
        <div className="grid gap-2">
          <Meter value={balance} max={allowance} label="AI tokens left" tone={balance <= 0 ? "bad" : "accent"} />
          <p className="text-xs text-faint">
            <span className="font-mono">{balance.toLocaleString("en")}</span> of{" "}
            <span className="font-mono">{allowance.toLocaleString("en")}</span> AI tokens left, as of your last reply.
          </p>
        </div>
      )}
    </div>
  );
}
