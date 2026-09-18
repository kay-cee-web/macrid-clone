"use client";

import Link from "next/link";
import { Coins } from "lucide-react";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { cn } from "@/lib/cn";
import { PLAN_HREF } from "@/lib/plans/plan";

const count = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/**
 * Tokens left on the account, as of the last reply (there is no balance
 * endpoint, so nothing shows before the first message). Links to Plan and billing.
 */
export function TokenBalance({ className }: { className?: string }) {
  const balance = useTokenBalance();
  if (balance === null) return null;
  const empty = balance <= 0;

  return (
    <Link
      href={PLAN_HREF}
      title={`${balance.toLocaleString("en")} tokens left as of the last reply. Manage your plan.`}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg px-2 font-mono text-xs transition-colors hover:bg-raised",
        empty ? "text-bad" : "text-muted hover:text-ink",
        className,
      )}
    >
      <Coins className="size-3.5" />
      {empty ? "No tokens left" : `${count.format(balance)} tokens`}
    </Link>
  );
}
