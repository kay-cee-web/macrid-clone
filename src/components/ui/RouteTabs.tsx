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

type RouteTabsProps = {
  label: string;
  tabs: RouteTab[];
  /** "underline": header tabs. "segmented": a pill switcher between sibling pages. */
  variant?: "underline" | "segmented";
  className?: string;
};

const STYLES = {
  underline: {
    nav: "flex gap-1 overflow-x-auto",
    tab: "-mb-px shrink-0 border-b-2 px-2.5 pb-2.5 pt-3 text-sm transition-colors",
    active: "border-ink font-medium text-ink",
    idle: "border-transparent text-muted hover:text-ink",
  },
  segmented: {
    nav: "inline-flex w-fit gap-1 rounded-xl bg-raised p-1",
    tab: "shrink-0 rounded-lg px-5 py-1.5 text-sm transition-colors",
    active: "bg-surface font-medium text-ink shadow-float",
    idle: "text-muted hover:text-ink",
  },
};

/** Tabs that navigate between routes; they scroll sideways when narrow. */
export function RouteTabs({ label, tabs, variant = "underline", className }: RouteTabsProps) {
  const pathname = usePathname();
  const style = STYLES[variant];

  return (
    <nav aria-label={label} className={cn(style.nav, className)}>
      {tabs.map((tab) => {
        const active = pathname === tab.href || (tab.matchPrefix && pathname.startsWith(`${tab.href}/`));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(style.tab, active ? style.active : style.idle)}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
