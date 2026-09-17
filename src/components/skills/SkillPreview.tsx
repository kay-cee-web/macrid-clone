"use client";

import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Markdown } from "@/components/ui/Markdown";
import { Modal } from "@/components/ui/Modal";
import { docFor, skillName } from "@/data/skills";
import { skillBody, skillFrontmatter } from "@/lib/skills/markdown";
import type { Skill } from "@/types/skill";

type Props = {
  skill: Skill;
  useLabel?: string;
  onClose: () => void;
  onUse: (skill: Skill) => void;
  onDownload: (skill: Skill) => void;
};

/** The skill's SKILL.md, the same text the download writes. */
export function SkillPreview({ skill, useLabel = "Use in chat", onClose, onUse, onDownload }: Props) {
  const header = skillFrontmatter(skill).join("\n");
  const body = skillBody(skill, docFor(skill.slug));

  return (
    <Modal
      open
      size="xl"
      onClose={onClose}
      title={skillName(skill)}
      description={skill.description}
      footer={
        <>
          <Button variant="secondary" icon={<Download className="size-4" />} onClick={() => onDownload(skill)}>
            Download SKILL.md
          </Button>
          <Button onClick={() => onUse(skill)}>{useLabel}</Button>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-[176px_1fr]">
        <aside className="hidden sm:grid content-start gap-1">
          <p className="px-2 font-mono text-xs uppercase tracking-[0.06em] text-faint">{skill.slug}</p>
          <p className="flex items-center gap-2 rounded-lg bg-raised px-2 py-1.5 font-mono text-sm text-ink ring-1 ring-inset ring-line">
            <FileText className="size-4 text-muted" />
            SKILL.md
          </p>
        </aside>
        <div className="grid min-w-0 gap-4 border-t border-line pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <pre className="overflow-x-auto rounded-[10px] border border-line bg-raised p-3 font-mono text-xs leading-relaxed text-muted">
            {header}
          </pre>
          <Markdown className="min-w-0">{body}</Markdown>
        </div>
      </div>
    </Modal>
  );
}
