"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import { Menu } from "@/components/ui/Menu";
import { useAuth } from "@/hooks/useAuth";
import { initialsOf } from "@/lib/format";

/** Account chip that opens a menu with Sign out. */
export function UserMenu({ placement = "bottom" }: { placement?: "bottom" | "top" }) {
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <Menu
      align="start"
      side={placement}
      className="w-full"
      items={[{ label: "Sign out", icon: <LogOut />, onSelect: () => void signOut() }]}
      trigger={(props) => (
        <button
          type="button"
          {...props}
          className="flex w-full min-w-0 items-center gap-2.5 rounded-[10px] px-1.5 py-1.5 text-left transition-colors hover:bg-raised"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-raised text-[12px] font-semibold text-ink ring-1 ring-inset ring-line">
            {initialsOf(user.name)}
          </span>
          <span className="grid min-w-0 flex-1">
            <span className="truncate text-[13.5px] font-medium">{user.name}</span>
            <span className="truncate text-[12px] text-muted">{user.email}</span>
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-faint" />
        </button>
      )}
    />
  );
}
