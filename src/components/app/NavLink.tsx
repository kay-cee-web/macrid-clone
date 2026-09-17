"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  /** Match nested routes too (e.g. /agents/12/workflows under /agents/12). */
  matchPrefix?: boolean;
  onNavigate?: () => void;
  className?: string;
};

export function NavLink({ href, children, icon, matchPrefix, onNavigate, className }: NavLinkProps) {
  const pathname = usePathname();
  const active = matchPrefix ? pathname === href || pathname.startsWith(`${href}/`) : pathname === href;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 text-base text-ink transition-colors [&_svg]:size-4.5",
        active ? "bg-raised font-medium" : "hover:bg-raised/70",
        className,
      )}
    >
      {icon && <span className="flex shrink-0 text-current">{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </Link>
  );
}
