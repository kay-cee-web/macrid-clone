import { cn } from "@/lib/cn";

/** The one ambient motion: a thin line sweeping while an agent works. */
export function WorkingTrace({ label, className }: { label: string; className?: string }) {
  return (
    <div role="status" className={cn("flex items-center gap-2.5 text-[12.5px] text-muted", className)}>
      <span className="relative h-0.5 w-28 overflow-hidden rounded-full bg-line">
        <span className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-accent animate-trace" />
      </span>
      {label}
    </div>
  );
}
