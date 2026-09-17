"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
  /** Show only the icon; the label becomes its accessible name. */
  iconOnly?: boolean;
};

type SegmentedControlProps<T extends string> = {
  label: string;
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  className?: string;
};

/** A small radio group styled as joined buttons (theme, grid/list, …). */
export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex rounded-[10px] border border-line bg-surface p-0.5", className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.iconOnly ? option.label : undefined}
            title={option.iconOnly ? option.label : undefined}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-7 items-center justify-center gap-1.5 rounded-[8px] text-xs font-medium",
              "transition-colors [&_svg]:size-3.5",
              option.iconOnly ? "w-7" : "px-2.5",
              active ? "bg-raised text-ink ring-1 ring-inset ring-line" : "text-faint hover:text-ink",
            )}
          >
            {option.icon}
            {!option.iconOnly && option.label}
          </button>
        );
      })}
    </div>
  );
}
