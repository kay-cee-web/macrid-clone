"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { MAIN_NAV } from "@/data/nav";
import { FavoriteAgents } from "./FavoriteAgents";
import { NavLink } from "./NavLink";
import { RecentAgents } from "./RecentAgents";
import { SidebarFooter } from "./SidebarFooter";
import { UpgradeCard } from "./UpgradeCard";
import { UserMenu } from "./UserMenu";

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto px-3 py-4">
      <Link href="/" onClick={onNavigate} className="self-start px-2 py-1" aria-label="Agents home">
        <Logo className="h-9" />
      </Link>

      <UserMenu placement="bottom" />

      <nav aria-label="Agents" className="grid gap-1">
        {MAIN_NAV.map(({ href, label, Icon, matchPrefix }) => (
          <NavLink key={href} href={href} icon={<Icon />} matchPrefix={matchPrefix} onNavigate={onNavigate}>
            {label}
          </NavLink>
        ))}
      </nav>

      <FavoriteAgents onNavigate={onNavigate} />
      <RecentAgents onNavigate={onNavigate} />

      <div className="mt-auto grid gap-4">
        <UpgradeCard />
        <SidebarFooter onNavigate={onNavigate} />
      </div>
    </div>
  );
}
