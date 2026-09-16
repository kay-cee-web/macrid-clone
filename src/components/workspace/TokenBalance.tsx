"use client";

import { Coins } from "lucide-react";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { macridAppLink } from "@/lib/config";
import { cn } from "@/lib/cn";

const count = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/**
 * Tokens left on the account, as of the last reply (there is no balance
 * endpoint, so nothing shows before the first message). Links to the plans page.
 */
export function TokenBalance({ className }: { className?: string }) {
  const balance = useTokenBalance();
  if (balance === null) return null;
  const empty = balance <= 0;

  return (
    <a
      href={macridAppLink("/settings/plans")}
      target="_blank"
      rel="noreferrer"
      title={`${balance.toLocaleString("en")} tokens left as of the last reply. Manage your plan.`}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg px-2 font-mono text-[12px] transition-colors hover:bg-raised",
        empty ? "text-bad" : "text-muted hover:text-ink",
        className,
      )}
    >
      <Coins className="size-3.5" />
      {empty ? "No tokens left" : `${count.format(balance)} tokens`}
    </a>
  );
}
