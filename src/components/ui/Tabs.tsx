"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TabItem<T extends string> = { value: T; label: string; badge?: ReactNode };

type TabsProps<T extends string> = {
  label: string;
  value: T;
  items: TabItem<T>[];
  onChange: (value: T) => void;
  className?: string;
};

/** Underlined tabs that scroll sideways on narrow screens. */
export function Tabs<T extends string>({ label, value, items, onChange, className }: TabsProps<T>) {
  return (
    <div className={cn("-mx-1 overflow-x-auto", className)}>
      <div role="tablist" aria-label={label} className="flex min-w-max gap-1 border-b border-line px-1">
        {items.map((item) => {
          const active = item.value === value;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(item.value)}
              className={cn(
                "-mb-px inline-flex items-center gap-2 border-b-2 px-2.5 py-2.5 text-[13.5px] transition-colors",
                active
                  ? "border-ink font-medium text-ink"
                  : "border-transparent text-muted hover:text-ink",
              )}
            >
              {item.label}
              {item.badge}
            </button>
          );
        })}
      </div>
    </div>
  );
}
