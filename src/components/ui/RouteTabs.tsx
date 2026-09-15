"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export type RouteTab = {
  href: string;
  label: string;
  /** Also active on nested routes (e.g. /records/lists/12 under /records/lists). */
  matchPrefix?: boolean;
};

/** Underlined tabs that navigate between routes; they scroll sideways when narrow. */
export function RouteTabs({ label, tabs, className }: { label: string; tabs: RouteTab[]; className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className={cn("flex gap-1 overflow-x-auto", className)}>
      {tabs.map((tab) => {
        const active = pathname === tab.href || (tab.matchPrefix && pathname.startsWith(`${tab.href}/`));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px shrink-0 border-b-2 px-2.5 pb-2.5 pt-3 text-[13.5px] transition-colors",
              active ? "border-ink font-medium text-ink" : "border-transparent text-muted hover:text-ink",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
