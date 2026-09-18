"use client";

import { useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { Menu } from "@/components/ui/Menu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { initialsOf } from "@/lib/format";
import { SettingsModal } from "./SettingsModal";

/** Avatar (account menu) on the left; theme and settings on the right. */
export function SidebarFooter() {
  const { user, signOut } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex items-center gap-1 px-1">
      {user && (
        <Menu
          align="start"
          side="top"
          items={[
            { label: "Settings", icon: <Settings />, onSelect: () => setSettingsOpen(true) },
            { label: "Sign out", icon: <LogOut />, onSelect: () => void signOut() },
          ]}
          trigger={(props) => (
            <button
              type="button"
              {...props}
              aria-label={`Account: ${user.email}`}
              title={`${user.name} · ${user.email}`}
              className="grid size-9 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-ink ring-2 ring-surface transition-[filter] hover:brightness-110"
            >
              {initialsOf(user.name).slice(0, 1)}
            </button>
          )}
        />
      )}

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Settings"
          title="Settings"
          onClick={() => setSettingsOpen(true)}
          className="inline-grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-raised hover:text-ink"
        >
          <Settings className="size-4.5" />
        </button>
      </div>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
