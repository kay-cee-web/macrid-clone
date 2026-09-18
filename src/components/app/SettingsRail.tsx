"use client";

import Link from "next/link";
import { CreditCard, KeyRound, Palette, UserRound, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { initialsOf } from "@/lib/format";
import type { User } from "@/types/auth";

export type SectionId = "workspace" | "members" | "plan" | "keys" | "personal" | "appearance";

export const SECTION_IDS: SectionId[] = ["workspace", "members", "plan", "keys", "personal", "appearance"];

export const sectionHref = (id: SectionId) => `/settings?section=${id}`;

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

/** Grouped section list: a sticky column beside the panel, a scrolling row on phones. */
export function SettingsRail({ workspace, user, value }: { workspace: string; user: User | null; value: SectionId }) {
  return (
    <nav
      aria-label="Settings sections"
      className="flex gap-1 overflow-x-auto md:sticky md:top-8 md:grid md:gap-5 md:self-start md:overflow-visible"
    >
      {GROUPS.map((group) => (
        <div key={group.heading} className="grid content-start gap-1 md:gap-0.5">
          <span className="hidden px-2.5 pb-1 text-xs font-medium text-faint md:block">{group.heading}</span>
          {group.items.map(({ id, label, Icon }) => (
            <Link
              key={id}
              href={sectionHref(id)}
              scroll={false}
              aria-current={value === id ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-left text-sm transition-colors [&_svg]:size-4",
                value === id
                  ? "bg-surface font-medium text-ink ring-1 ring-inset ring-line"
                  : "text-muted hover:bg-raised hover:text-ink",
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
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
