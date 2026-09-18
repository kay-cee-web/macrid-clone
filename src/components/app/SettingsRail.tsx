"use client";

import { CreditCard, KeyRound, Palette, UserRound, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { initialsOf } from "@/lib/format";
import type { User } from "@/types/auth";

export type SectionId = "workspace" | "members" | "plan" | "keys" | "personal" | "appearance";

type Item = { id: SectionId; label: string; Icon?: LucideIcon };

const GROUPS: { heading: string; items: Item[] }[] = [
  {
    heading: "Workspace",
    items: [
      { id: "workspace", label: "Workspace" },
      { id: "members", label: "Members", Icon: Users },
      { id: "plan", label: "Plan and billing", Icon: CreditCard },
      { id: "keys", label: "API keys", Icon: KeyRound },
    ],
  },
  {
    heading: "Account",
    items: [
      { id: "personal", label: "Personal settings", Icon: UserRound },
      { id: "appearance", label: "Appearance", Icon: Palette },
    ],
  },
];

/** Grouped section list: a column beside the panel, a scrolling row on phones. */
export function SettingsRail({
  workspace,
  user,
  value,
  onChange,
}: {
  workspace: string;
  user: User | null;
  value: SectionId;
  onChange: (id: SectionId) => void;
}) {
  return (
    <nav
      aria-label="Settings sections"
      className="flex shrink-0 gap-1 overflow-x-auto border-b border-line bg-raised/50 p-3 sm:flex-col sm:gap-5 sm:overflow-y-auto sm:border-b-0 sm:border-r sm:p-4"
    >
      {GROUPS.map((group) => (
        <div key={group.heading} className="grid content-start gap-1 sm:gap-0.5">
          <span className="hidden px-2.5 pb-1 text-xs font-medium text-faint sm:block">{group.heading}</span>
          {group.items.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-current={value === id ? "page" : undefined}
              onClick={() => onChange(id)}
              className={cn(
                "flex items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-left text-sm transition-colors [&_svg]:size-4",
                value === id ? "bg-surface font-medium text-ink shadow-float" : "text-muted hover:bg-surface/70 hover:text-ink",
              )}
            >
              {Icon ? (
                <Icon />
              ) : (
                <span className="grid size-4.5 shrink-0 place-items-center rounded bg-accent text-[0.6rem] font-semibold text-accent-ink">
                  {user ? initialsOf(user.name).slice(0, 1) : "?"}
                </span>
              )}
              <span className="min-w-0 truncate">{id === "workspace" ? workspace : label}</span>
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
}
