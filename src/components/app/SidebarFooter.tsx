"use client";

import type { ReactNode } from "react";
import { CircleHelp, Inbox, LogOut, Settings } from "lucide-react";
import { Menu } from "@/components/ui/Menu";
import { ThemeCycleButton } from "@/components/ui/ThemeCycleButton";
import { useAuth } from "@/hooks/useAuth";
import { dexisphereAppLink } from "@/lib/config";
import { initialsOf } from "@/lib/format";

const ROUND = "inline-grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-raised hover:text-ink";

/** A round icon link into the main Dexisphere app (opens in a new tab). */
function AppLink({ path, label, children }: { path: string; label: string; children: ReactNode }) {
  return (
    <a href={dexisphereAppLink(path)} target="_blank" rel="noreferrer" aria-label={label} title={label} className={ROUND}>
      {children}
    </a>
  );
}

/** Avatar (account menu) on the left; theme and shortcuts into the main app on the right. */
export function SidebarFooter() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex items-center gap-1 px-1 [&_svg]:size-4.5">
      {user && (
        <Menu
          align="start"
          side="top"
          items={[{ label: "Sign out", icon: <LogOut />, onSelect: () => void signOut() }]}
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

      <div className="ml-auto flex items-center gap-0.5">
        <ThemeCycleButton />
        <AppLink path="/help-center" label="Help center">
          <CircleHelp />
        </AppLink>
        <AppLink path="/settings" label="Account settings">
          <Settings />
        </AppLink>
        <AppLink path="/crm/mail" label="Inbox">
          <Inbox />
        </AppLink>
      </div>
    </div>
  );
}
