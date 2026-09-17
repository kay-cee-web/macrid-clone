"use client";

import Link from "next/link";
import { Cpu, Database, House, LayoutGrid } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { NavLink } from "./NavLink";
import { RecentAgents } from "./RecentAgents";
import { SidebarFooter } from "./SidebarFooter";
import { UpgradeCard } from "./UpgradeCard";
import { UserMenu } from "./UserMenu";

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto px-3 py-4">
      <Link href="/agents" onClick={onNavigate} className="self-start px-2 py-1" aria-label="Agents home">
        <Logo className="h-9" />
      </Link>

      <UserMenu placement="bottom" />

      <nav aria-label="Agents" className="grid gap-1">
        <NavLink href="/agents" icon={<House />} onNavigate={onNavigate}>
          Home
        </NavLink>
        <NavLink href="/agents/all" icon={<LayoutGrid />} onNavigate={onNavigate}>
          All agents
        </NavLink>
        <NavLink href="/agents/models" icon={<Cpu />} onNavigate={onNavigate}>
          Models
        </NavLink>
        <NavLink href="/records" icon={<Database />} matchPrefix onNavigate={onNavigate}>
          Records
        </NavLink>
      </nav>

      <RecentAgents onNavigate={onNavigate} />

      <div className="mt-auto grid gap-4">
        <UpgradeCard />
        <SidebarFooter />
      </div>
    </div>
  );
}
