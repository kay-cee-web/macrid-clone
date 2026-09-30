import type { ReactNode } from "react";

/**
 * One section of the briefing. The heading carries a quiet aside saying what
 * kind of thing this is ("no action needed"), which is how the three sections
 * stay told apart without each one shouting.
 */
export function BriefingSection({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-3">
      <div className="flex items-baseline gap-2">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {aside && <span className="text-xs text-muted">{aside}</span>}
      </div>
      {children}
    </section>
  );
}
