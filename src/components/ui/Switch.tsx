"use client";

import { cn } from "@/lib/cn";

type SwitchProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
};

/** On/off toggle. `label` is its accessible name; show visible text beside it. */
export function Switch({ id, checked, onChange, label, disabled, className }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-accent" : "bg-line",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0.5 size-5 rounded-full shadow-sm transition-transform",
          checked ? "translate-x-4 bg-accent-ink" : "translate-x-0 bg-surface",
        )}
      />
    </button>
  );
}
