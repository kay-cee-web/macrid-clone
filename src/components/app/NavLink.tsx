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
        "flex min-w-0 items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13.5px] transition-colors [&_svg]:size-4",
        active
          ? "bg-raised font-medium text-ink ring-1 ring-inset ring-line"
          : "text-muted hover:bg-raised hover:text-ink",
        className,
      )}
    >
      {icon && <span className="flex shrink-0 text-current">{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </Link>
  );
}
