"use client";

import { useState } from "react";
import { CATEGORIES, IDEAS, readyCountIn } from "@/data/ideas";
import { Eyebrow } from "@/components/ui/Card";
import { HairlineGrid } from "@/components/ui/HairlineGrid";
import { Tabs } from "@/components/ui/Tabs";
import type { Idea, IdeaCategory } from "@/types/idea";
import { IdeaCard } from "./IdeaCard";

/** Category tabs over a hairline grid of standing tasks. */
export function IdeaBrowser({ onPick }: { onPick: (idea: Idea) => void }) {
  const [category, setCategory] = useState<IdeaCategory>("Prospecting");
  const ideas = IDEAS[category];
  const ready = readyCountIn(category);

  return (
    <section aria-labelledby="ideas-heading" className="grid gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="ideas-heading" className="text-[20px] font-semibold">
          Or start from a standing task
        </h2>
        <Eyebrow>
          {ready} of {ideas.length} ready today
        </Eyebrow>
      </div>

      <Tabs
        label="Task categories"
        value={category}
        onChange={setCategory}
        items={CATEGORIES.map((c) => ({ value: c, label: c }))}
      />

      <div role="tabpanel" aria-label={category}>
        <HairlineGrid itemCount={ideas.length}>
          {ideas.map((idea) => (
            <IdeaCard key={idea.title} idea={idea} onPick={onPick} />
          ))}
        </HairlineGrid>
      </div>
    </section>
  );
}
