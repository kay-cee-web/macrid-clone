import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type PillTone = "good" | "warn" | "bad" | "accent" | "neutral";

const tones: Record<PillTone, string> = {
  good: "bg-good-soft text-good",
  warn: "bg-warn-soft text-warn",
  bad: "bg-bad-soft text-bad",
  accent: "bg-accent-soft text-accent",
  neutral: "bg-raised text-muted ring-1 ring-inset ring-line",
};

/** Status and machine values. Mono by design: the system produced it. */
export function Pill({
  tone = "neutral",
  dot = false,
  className,
  children,
}: {
  tone?: PillTone;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 font-mono text-[11px] leading-none",
        tones[tone],
        className,
      )}
    >
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
