import { cn } from "@/lib/cn";

/** Ink tile with a lagoon square: the agent inside the platform. */
export function Logo({ withWordmark = true, className }: { withWordmark?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span aria-hidden className="grid size-7 place-items-center rounded-[8px] bg-ink">
        <span className="size-2.5 rounded-[3px] bg-accent" />
      </span>
      {withWordmark && (
        <span className="font-display text-[16px] font-semibold tracking-[-0.01em] text-ink">
          Macrid <span className="text-muted">Agents</span>
        </span>
      )}
    </span>
  );
}
