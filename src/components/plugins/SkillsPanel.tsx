"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HairlineGrid } from "@/components/ui/HairlineGrid";
import { Tabs } from "@/components/ui/Tabs";
import { useWorkspace } from "@/components/workspace/WorkspaceContext";
import { PLATFORMS } from "@/data/platforms";
import { CREATE_SKILL_PROMPT, FEATURED_SKILLS, SKILLS, SKILL_CATEGORIES, skillPrompt, type Skill, type SkillCategory } from "@/data/skills";

type Filter = "all" | SkillCategory;

function SkillCard({ skill, onUse, featured }: { skill: Skill; onUse: (skill: Skill) => void; featured?: boolean }) {
  return (
    <article className="grid content-start gap-2.5 bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.06em] text-faint">{skill.surface}</span>
        {featured && <span className="font-mono text-xs uppercase tracking-[0.06em] text-accent">Featured</span>}
      </div>
      <h3 className="font-mono text-sm font-medium text-ink">
        {skill.name ? <span className="font-display text-base font-semibold">{skill.name}</span> : `/${skill.slug}`}
      </h3>
      <p className="text-sm leading-relaxed text-muted">{skill.description}</p>
      {skill.platforms?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {skill.platforms.map((id) => (
            <span key={id} className="rounded-md border border-line bg-raised px-1.5 py-0.5 text-xs text-muted">{PLATFORMS[id].name}</span>
          ))}
        </div>
      ) : null}
      <Button variant="secondary" size="sm" className="mt-1 justify-self-start" onClick={() => onUse(skill)}>
        Use in chat
      </Button>
    </article>
  );
}

/** Skills are typed into the chat as /slug; using one drafts that for the agent. */
export function SkillsPanel() {
  const { agent } = useWorkspace();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const skills = filter === "all" ? SKILLS : SKILLS.filter((s) => s.category === filter);

  const draft = (text: string) => router.push(`/agents/${agent.id}?task=${encodeURIComponent(text)}`);

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <p className="min-w-0 flex-1 basis-72 text-sm text-muted">
          Skills are proven ways of doing a job. Type <code className="font-mono text-ink">/skill-name</code> in the chat, or
          pick one here.
        </p>
        <Button variant="secondary" icon={<Plus className="size-4" />} onClick={() => draft(CREATE_SKILL_PROMPT)}>
          Create a skill
        </Button>
      </div>

      <section className="grid gap-3">
        <h3 className="text-lg font-semibold">Featured</h3>
        <HairlineGrid itemCount={FEATURED_SKILLS.length}>
          {FEATURED_SKILLS.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} featured onUse={(s) => draft(skillPrompt(s.slug))} />
          ))}
        </HairlineGrid>
      </section>

      <section className="grid gap-3">
        <h3 className="text-lg font-semibold">All skills</h3>
        <Tabs
          label="Skill categories"
          value={filter}
          onChange={setFilter}
          items={[{ value: "all", label: "All" }, ...SKILL_CATEGORIES.map((c) => ({ value: c, label: c }))]}
        />
        <HairlineGrid itemCount={skills.length}>
          {skills.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} onUse={(s) => draft(skillPrompt(s.slug))} />
          ))}
        </HairlineGrid>
      </section>
    </div>
  );
}
