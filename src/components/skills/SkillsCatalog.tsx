"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, SearchX } from "lucide-react";
import { WorkbenchTabs } from "@/components/workbench/WorkbenchTabs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { Input } from "@/components/ui/Input";
import {
  ALL_SKILLS,
  CREATE_SKILL_PROMPT,
  SKILL_CATEGORIES,
  skillName,
  skillPrompt,
} from "@/data/skills";
import { useSkillActions } from "@/hooks/useSkillActions";
import type { Skill, SkillCategory } from "@/types/skill";
import { SkillPreview } from "./SkillPreview";
import { SkillRow } from "./SkillRow";

type Filter = "all" | SkillCategory;

const matches = (skill: Skill, query: string) =>
  `${skillName(skill)} ${skill.slug} ${skill.surface} ${skill.description}`.toLowerCase().includes(query);

/** The skills hub: every skill in the catalogue, previewable and ready to use. */
export function SkillsCatalog() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const { previewing, preview, closePreview, download } = useSkillActions();

  const q = query.trim().toLowerCase();
  const visible = ALL_SKILLS.filter(
    (skill) => (filter === "all" || skill.category === filter) && (!q || matches(skill, q)),
  );

  /** Skills run in a chat, so using one drafts it on the home composer. */
  const draft = (text: string) => router.push(`/?task=${encodeURIComponent(text)}`);
  const use = (skill: Skill) => draft(skillPrompt(skill.slug));

  return (
    <div className="mx-auto grid w-full max-w-400 gap-8 px-4 pb-20 pt-10 sm:px-8 xl:px-14">
      <WorkbenchTabs />

      <header className="flex flex-wrap items-start justify-between gap-6">
        <div className="grid gap-2">
          <h1 className="font-sans text-2xl font-normal tracking-normal text-ink">Skills</h1>
          <p className="max-w-[62ch] text-sm text-muted">
            Proven ways of doing a job, written out so an agent follows the same steps every time. Use one here, or
            type <code className="rounded-[5px] bg-raised px-1 py-0.5 font-mono text-[0.9em] text-ink">/skill-name</code>{" "}
            in any chat.
          </p>
        </div>
        <Button variant="secondary" icon={<Plus className="size-4" />} onClick={() => draft(CREATE_SKILL_PROMPT)}>
          Create skill
        </Button>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterChips
          label="Skill categories"
          variant="outline"
          value={filter}
          onChange={setFilter}
          items={[{ value: "all" as Filter, label: "All" }, ...SKILL_CATEGORIES.map((c) => ({ value: c as Filter, label: c }))]}
        />
        <label htmlFor="skill-search" className="sr-only">
          Search skills
        </label>
        <Input
          id="skill-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search skills…"
          leading={<Search />}
          className="h-10 w-full rounded-lg border-transparent bg-raised sm:w-72"
        />
      </div>

      <section className="grid gap-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.06em] text-faint">
          {filter === "all" ? "All skills" : filter} ({visible.length})
        </h2>
        {visible.length === 0 ? (
          <EmptyState
            icon={<SearchX />}
            title="No skills match"
            description={q ? `Nothing matches “${query.trim()}”.` : "No skills in this category yet."}
            action={
              <Button variant="secondary" onClick={() => { setQuery(""); setFilter("all"); }}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {visible.map((skill) => (
              <SkillRow key={skill.slug} skill={skill} onUse={use} onPreview={preview} onDownload={download} />
            ))}
          </div>
        )}
      </section>

      {previewing && (
        <SkillPreview skill={previewing} onClose={closePreview} onUse={use} onDownload={download} />
      )}
    </div>
  );
}
