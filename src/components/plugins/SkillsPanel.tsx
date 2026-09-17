"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Plus } from "lucide-react";
import { SkillPreview } from "@/components/skills/SkillPreview";
import { SkillRow } from "@/components/skills/SkillRow";
import { Button } from "@/components/ui/Button";
import { FilterChips } from "@/components/ui/FilterChips";
import { useWorkspace } from "@/components/workspace/WorkspaceContext";
import { ALL_SKILLS, CREATE_SKILL_PROMPT, SKILL_CATEGORIES, skillPrompt } from "@/data/skills";
import { useSkillActions } from "@/hooks/useSkillActions";
import type { Skill, SkillCategory } from "@/types/skill";

type Filter = "all" | SkillCategory;

/** Skills are typed into the chat as /slug; using one drafts that for this agent. */
export function SkillsPanel() {
  const { agent } = useWorkspace();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const { previewing, preview, closePreview, download } = useSkillActions();

  const skills = filter === "all" ? ALL_SKILLS : ALL_SKILLS.filter((s) => s.category === filter);
  const draft = (text: string) => router.push(`/agents/${agent.id}?task=${encodeURIComponent(text)}`);
  const use = (skill: Skill) => draft(skillPrompt(skill.slug));

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <p className="min-w-0 flex-1 basis-72 text-sm text-muted">
          Skills are proven ways of doing a job. Open one to read its steps, or send it straight to{" "}
          {agent.name}&apos;s chat.
        </p>
        <Button variant="secondary" icon={<Plus className="size-4" />} onClick={() => draft(CREATE_SKILL_PROMPT)}>
          Create a skill
        </Button>
        <Button variant="ghost" icon={<ExternalLink className="size-4" />} onClick={() => router.push("/agents/skills")}>
          Browse all
        </Button>
      </div>

      <FilterChips
        label="Skill categories"
        variant="outline"
        value={filter}
        onChange={setFilter}
        items={[{ value: "all" as Filter, label: "All" }, ...SKILL_CATEGORIES.map((c) => ({ value: c as Filter, label: c }))]}
      />

      <div className="grid gap-3 xl:grid-cols-2">
        {skills.map((skill) => (
          <SkillRow
            key={skill.slug}
            skill={skill}
            useLabel="Use in chat"
            onUse={use}
            onPreview={preview}
            onDownload={download}
          />
        ))}
      </div>

      {previewing && (
        <SkillPreview skill={previewing} onClose={closePreview} onUse={use} onDownload={download} />
      )}
    </div>
  );
}
