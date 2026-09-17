"use client";

import { ArrowLeftRight, LogOut } from "lucide-react";
import { Menu } from "@/components/ui/Menu";
import { useAuth } from "@/hooks/useAuth";
import { firstName, initialsOf } from "@/lib/format";

/** The workspace card at the top of the sidebar; opens a menu with Sign out. */
export function UserMenu({ placement = "bottom" }: { placement?: "bottom" | "top" }) {
  const { user, signOut } = useAuth();
  if (!user) return null;
  const owner = firstName(user.name);

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
          title={user.email}
          className="flex w-full min-w-0 items-center gap-2.5 rounded-xl border border-line bg-surface p-2 text-left shadow-float transition-colors hover:bg-raised"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent text-xs font-semibold text-accent-ink">
            {initialsOf(user.name).slice(0, 1)}
          </span>
          <span className="min-w-0 flex-1 truncate text-base font-medium">
            {owner ? `${owner}'s workspace` : "Your workspace"}
          </span>
          <ArrowLeftRight className="size-4 shrink-0 text-muted" />
        </button>
      )}
    />
  );
}
