"use client";

import { cn } from "@/lib/cn";

type FilterChipsProps<T extends string> = {
  label: string;
  value: T;
  items: { value: T; label: string }[];
  onChange: (value: T) => void;
  /** "solid": filled rounded pills. "outline": bordered tags on the surface (toolbars). */
  variant?: "solid" | "outline";
  className?: string;
};

const STYLES = {
  solid: {
    base: "rounded-full px-4 py-2",
    active: "bg-ink font-medium text-ground",
    idle: "bg-raised/80 text-muted hover:bg-raised hover:text-ink",
  },
  outline: {
    base: "h-10 rounded-lg border bg-surface px-4",
    active: "border-ink/60 text-ink",
    idle: "border-line text-muted hover:border-faint hover:text-ink",
  },
};

/** Pick-one chips (a tablist) that scroll sideways on narrow screens. */
export function FilterChips<T extends string>({
  label, value, items, onChange, variant = "solid", className,
}: FilterChipsProps<T>) {
  const style = STYLES[variant];

  return (
    <div className={cn("-mx-1 overflow-x-auto px-1 py-1", className)}>
      <div role="tablist" aria-label={label} className="flex min-w-max gap-2">
        {items.map((item) => {
          const active = item.value === value;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(item.value)}
              className={cn("text-sm transition-colors", style.base, active ? style.active : style.idle)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
