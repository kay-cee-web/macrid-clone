"use client";

import Link from "next/link";
import { PanelLeftClose } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";
import { MAIN_NAV } from "@/data/nav";
import { FavoriteAgents } from "./FavoriteAgents";
import { NavLink } from "./NavLink";
import { RecentAgents } from "./RecentAgents";
import { SidebarFooter } from "./SidebarFooter";
import { UpgradeCard } from "./UpgradeCard";
import { UserMenu } from "./UserMenu";

type AppSidebarProps = {
  onNavigate?: () => void;
  /** Desktop only: folds the sidebar to its icon rail. The drawer closes with its own button. */
  onCollapse?: () => void;
};

export function AppSidebar({ onNavigate, onCollapse }: AppSidebarProps) {
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto px-3 py-4">
      <div className="flex items-center justify-between gap-2">
        <Link href="/" onClick={onNavigate} className="px-2 py-1" aria-label="Agents home">
          <Logo className="h-9" />
        </Link>
        {onCollapse && (
          <IconButton label="Close sidebar" onClick={onCollapse} className="size-10 rounded-xl">
            <PanelLeftClose />
          </IconButton>
        )}
      </div>

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
