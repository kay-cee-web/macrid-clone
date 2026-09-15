import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type HairlineGridProps = {
  /** How many children are rendered, so the last row can be filled. */
  itemCount: number;
  /** "responsive": 1 → 2 (sm) → 3 (xl) columns. "single": a stacked list. */
  columns?: "responsive" | "single";
  className?: string;
  children: ReactNode;
};

/**
 * Items separated by 1px lines instead of individual card borders. Filler
 * cells complete the last row so the line colour never shows as a hole.
 */
export function HairlineGrid({ itemCount, columns = "responsive", className, children }: HairlineGridProps) {
  const responsive = columns === "responsive";
  const fillThree = responsive ? (3 - (itemCount % 3)) % 3 : 0;
  const fillTwo = responsive && itemCount % 2 === 1;

  return (
    <div
      className={cn(
        "grid gap-px overflow-hidden rounded-[14px] border border-line bg-line",
        responsive && "sm:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {children}
      {Array.from({ length: fillThree }, (_, i) => (
        <div key={`fill-3-${i}`} aria-hidden className="hidden bg-surface xl:block" />
      ))}
      {fillTwo && <div aria-hidden className="hidden bg-surface sm:block xl:hidden" />}
    </div>
  );
}
