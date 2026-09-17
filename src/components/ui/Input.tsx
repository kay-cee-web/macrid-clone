import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  /** Icon or text shown inside the field, before the value. */
  leading?: ReactNode;
  /** Control shown inside the field, after the value (e.g. show password). */
  trailing?: ReactNode;
};

export function Input({ invalid, leading, trailing, className, ...rest }: InputProps) {
  return (
    <div
      className={cn(
        "flex h-11 items-center gap-2 rounded-[10px] border bg-surface px-3 transition-colors",
        "focus-within:border-accent focus-within:ring-3 focus-within:ring-accent-soft",
        invalid ? "border-bad" : "border-line hover:border-faint",
        className,
      )}
    >
      {leading && <span className="flex text-faint [&_svg]:size-4">{leading}</span>}
      <input
        aria-invalid={invalid || undefined}
        className="h-full min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-faint"
        {...rest}
      />
      {trailing}
    </div>
  );
}
