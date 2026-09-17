import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean };

/** Native select (keyboard, mobile pickers and optgroups for free), styled to match Input. */
export function Select({ invalid, className, children, ...rest }: SelectProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        aria-invalid={invalid || undefined}
        className={cn(
          "h-10 w-full appearance-none rounded-[10px] border bg-surface pl-3 pr-9 text-base text-ink outline-none sm:text-sm",
          "transition-colors hover:border-faint focus:border-accent focus:ring-3 focus:ring-accent-soft",
          "disabled:cursor-not-allowed disabled:opacity-60",
          invalid ? "border-bad" : "border-line",
        )}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
    </div>
  );
}
