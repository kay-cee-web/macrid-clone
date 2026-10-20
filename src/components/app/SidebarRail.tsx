"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftOpen } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { MAIN_NAV, SETTINGS_NAV, type NavItem } from "@/data/nav";
import { cn } from "@/lib/cn";
import { isActivePath } from "@/lib/ui/nav";

function RailLink({ item, active }: { item: NavItem; active: boolean }) {
  const { href, label, Icon } = item;
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "grid size-10 place-items-center rounded-xl text-ink transition-colors [&_svg]:size-4.5",
        active ? "bg-raised" : "text-muted hover:bg-raised/70 hover:text-ink",
      )}
    >
      <Icon />
    </Link>
  );
}

/** The collapsed sidebar: the open button, then each section as an icon. */
export function SidebarRail({ onExpand }: { onExpand: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col items-center gap-5 py-4">
      <IconButton label="Open sidebar" onClick={onExpand} className="size-10 rounded-xl">
        <PanelLeftOpen />
      </IconButton>
      <nav aria-label="Agents" className="grid gap-1">
        {MAIN_NAV.map((item) => (
          <RailLink key={item.href} item={item} active={isActivePath(pathname, item.href, item.matchPrefix)} />
        ))}
      </nav>
      <div className="mt-auto">
        <RailLink item={SETTINGS_NAV} active={isActivePath(pathname, SETTINGS_NAV.href, SETTINGS_NAV.matchPrefix)} />
      </div>
    </div>
  );
}
