import { Zap } from "lucide-react";
import { dexisphereAppLink } from "@/lib/config";

/** Sidebar nudge to the plans page, where tokens for agent turns are bought. */
export function UpgradeCard() {
  return (
    <a
      href={dexisphereAppLink("/settings/plans")}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-float transition-colors hover:bg-raised"
    >
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="text-base font-medium text-ink">Upgrade your plan</span>
        <span className="text-sm text-muted">More tokens for your agents</span>
      </span>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-accent-ink shadow-glow">
        <Zap className="size-4.5 fill-current" />
      </span>
    </a>
  );
}
