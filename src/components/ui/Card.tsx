import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Floating surfaces (composer, popovers) get the shadow; panels don't. */
  floating?: boolean;
  padded?: boolean;
};

export function Card({ floating, padded = true, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-line bg-surface",
        floating && "shadow-float",
        padded && "p-5",
        className,
      )}
      {...rest}
    />
  );
}

/** Small uppercase mono label used above sections and inside cards. */
export function Eyebrow({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted", className)}
      {...rest}
    />
  );
}
