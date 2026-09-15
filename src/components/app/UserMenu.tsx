"use client";

import { LogOut } from "lucide-react";
import { Menu } from "@/components/ui/Menu";
import { useAuth } from "@/hooks/useAuth";

export const initialsOf = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

export function UserMenu() {
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <Menu
      align="end"
      items={[{ label: "Sign out", icon: <LogOut />, onSelect: () => void signOut() }]}
      trigger={(props) => (
        <button
          type="button"
          {...props}
          className="flex items-center gap-2.5 rounded-[10px] px-1.5 py-1 text-left transition-colors hover:bg-raised"
        >
          <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-[12px] font-semibold text-accent">
            {initialsOf(user.name)}
          </span>
          <span className="hidden min-w-0 sm:grid">
            <span className="truncate text-[13.5px] font-medium">{user.name}</span>
            <span className="truncate text-[12px] text-muted">{user.email}</span>
          </span>
        </button>
      )}
    />
  );
}
