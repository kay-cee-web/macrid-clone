"use client";

import { Download, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Menu } from "@/components/ui/Menu";
import { Pill } from "@/components/ui/Pill";
import { COVERS } from "@/data/ideas/covers";
import { isFeatured, skillName } from "@/data/skills";
import { cn } from "@/lib/cn";
import type { Skill } from "@/types/skill";

export type SkillRowProps = {
  skill: Skill;
  /** Label for the primary action, e.g. "Use" or "Use in chat". */
  useLabel?: string;
  onUse: (skill: Skill) => void;
  onPreview: (skill: Skill) => void;
  onDownload: (skill: Skill) => void;
};

/**
 * One catalogue row. The body opens the SKILL.md preview; the actions sit on
 * the right, revealed on hover and always shown to keyboards and touch.
 */
export function SkillRow({ skill, useLabel = "Use", onUse, onPreview, onDownload }: SkillRowProps) {
  const { Icon, tint } = COVERS[skill.surface];

  return (
    <article className="group flex items-center gap-3 rounded-[14px] border border-line bg-surface p-3 transition-colors hover:border-faint focus-within:border-faint">
      <span aria-hidden className={cn("grid size-9 shrink-0 place-items-center rounded-[10px] text-surface [&_svg]:size-4.5", tint)}>
        <Icon />
      </span>

      <button
        type="button"
        onClick={() => onPreview(skill)}
        className="min-w-0 flex-1 rounded-lg text-left outline-none focus-visible:ring-3 focus-visible:ring-accent-soft"
      >
        <span className="flex items-center gap-2">
          <span className="truncate font-medium text-ink">{skillName(skill)}</span>
          {isFeatured(skill.slug) && <Pill tone="accent">Featured</Pill>}
        </span>
        <span className="mt-0.5 block truncate text-sm text-muted">{skill.description}</span>
      </button>

      <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <Menu
          items={[
            { label: "View details", icon: <Eye />, onSelect: () => onPreview(skill) },
            { label: "Download SKILL.md", icon: <Download />, onSelect: () => onDownload(skill) },
          ]}
          trigger={(props) => (
            <IconButton label={`More for ${skillName(skill)}`} {...props}>
              <MoreHorizontal />
            </IconButton>
          )}
        />
        <Button size="sm" onClick={() => onUse(skill)}>
          {useLabel}
        </Button>
      </div>
    </article>
  );
}
