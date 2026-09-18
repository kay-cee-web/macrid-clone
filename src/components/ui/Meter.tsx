import { cn } from "@/lib/cn";

/**
 * A filled track for a known fraction of a known total. Only draw one when both
 * numbers are real: a bar at an estimated value reads as a measurement.
 */
export function Meter({
  value,
  max,
  label,
  tone = "accent",
  className,
}: {
  value: number;
  max: number;
  /** Read out to screen readers, e.g. "Tokens left". */
  label: string;
  tone?: "accent" | "bad";
  className?: string;
}) {
  const fraction = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-raised ring-1 ring-inset ring-line", className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width]", tone === "bad" ? "bg-bad" : "bg-accent")}
        style={{ width: `${fraction * 100}%` }}
      />
    </div>
  );
}
