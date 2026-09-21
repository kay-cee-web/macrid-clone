"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV, SETTINGS_NAV } from "@/data/nav";
import { cn } from "@/lib/cn";
import { isActivePath, isAgentWorkspace } from "@/lib/ui/nav";

const TABS = [...MAIN_NAV, SETTINGS_NAV];

/**
 * Below `lg`, the sections as a tab bar under <main>. It sits in the flow rather than
 * fixed, so nothing scrolls beneath it. An open agent hides it: the chat's composer owns
 * the bottom edge there, and the drawer still reaches everything.
 */
export function BottomTabs() {
  const pathname = usePathname();
  if (isAgentWorkspace(pathname)) return null;

  return (
    <nav
      aria-label="Sections"
      className="shrink-0 border-t border-line bg-surface/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {TABS.map(({ href, label, Icon, matchPrefix }) => {
          const active = isActivePath(pathname, href, matchPrefix);
          return (
            <li key={href} className="min-w-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 px-1 pb-2 pt-2 text-xs transition-colors",
                  active ? "font-medium text-ink" : "text-muted hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                    active && "bg-accent-soft text-accent",
                  )}
                >
                  <Icon aria-hidden className="size-5" />
                </span>
                <span className="max-w-full truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
