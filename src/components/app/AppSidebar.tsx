"use client";

import Link from "next/link";
import { House, LayoutGrid } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NavLink } from "./NavLink";
import { RecentAgents } from "./RecentAgents";
import { UserMenu } from "./UserMenu";

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 px-3 py-4">
      <Link href="/agents" onClick={onNavigate} className="px-2 py-1" aria-label="Agents home">
        <Logo />
      </Link>

      <nav aria-label="Agents" className="grid gap-0.5">
        <NavLink href="/agents" icon={<House />} onNavigate={onNavigate}>
          Home
        </NavLink>
        <NavLink href="/agents/all" icon={<LayoutGrid />} onNavigate={onNavigate}>
          All agents
        </NavLink>
      </nav>

      <RecentAgents onNavigate={onNavigate} />

      <div className="mt-auto grid gap-3 border-t border-line pt-3">
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="text-[12.5px] text-muted">Theme</span>
          <ThemeToggle />
        </div>
        <UserMenu placement="top" />
      </div>
    </div>
  );
}
