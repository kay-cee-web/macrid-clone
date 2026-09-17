import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  /** Right-aligned extra next to the label, e.g. "Forgot password?". */
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Label + control + hint/error, with ids wired for screen readers. */
export function Field({ id, label, error, hint, aside, className, children }: FieldProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-bad">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** aria-describedby value matching what Field renders. */
export const describedBy = (id: string, error?: string, hint?: unknown) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;
