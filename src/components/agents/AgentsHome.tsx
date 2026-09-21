"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AnnouncementPill } from "@/components/ui/AnnouncementPill";
import { buttonStyles } from "@/components/ui/button-styles";
import { TokenBalance } from "@/components/workspace/TokenBalance";
import { ComposerWithAttachments } from "@/components/chat/ComposerWithAttachments";
import { SuggestionChips } from "@/components/chat/SuggestionChips";
import { useCreateAgent } from "@/hooks/useCreateAgent";
import { useGreeting } from "@/hooks/useGreeting";
import { dexisphereAppLink } from "@/lib/config";
import type { Idea } from "@/types/idea";
import { IdeaBrowser } from "./IdeaBrowser";

const PILL = "h-10 rounded-full border border-line bg-surface/80 px-4 shadow-float backdrop-blur";

export function AgentsHome() {
  const searchParams = useSearchParams();
  // `?task=` still drafts here: a skill's "Use" lands on home with `/slug` to finish typing.
  const [task, setTask] = useState(() => searchParams.get("task") ?? "");
  const { create, creating } = useCreateAgent();
  const greeting = useGreeting();

  /**
   * Everything on home starts work: the typed task, a suggestion and an idea card each make the
   * agent and open its chat with the task already sent, rather than leaving it in a composer.
   */
  const startNow = (text: string) => void create(text, [], { send: true });
  const pickIdea = (idea: Idea) => startNow(idea.description);

  return (
    <div className="min-h-full">
      <div className="flex items-center justify-end gap-2 px-4 pt-4 sm:px-6">
        <TokenBalance className={PILL} />
        <a
          href={dexisphereAppLink("/")}
          target="_blank"
          rel="noreferrer"
          className={buttonStyles({ variant: "secondary", className: PILL })}
        >
          <ExternalLink className="size-4" />
          Dexisphere app
        </a>
      </div>

      {/* As wide as the agent hub, so the task cards fill the space; the hero stays narrow inside it. */}
      <div className="mx-auto grid w-full max-w-400 gap-24 px-4 pb-20 pt-12 sm:px-8 lg:pt-[10vh] xl:px-14">
        <section className="mx-auto grid w-full max-w-3xl justify-items-center gap-10">
          <div className="grid justify-items-center gap-8 text-center">
            <AnnouncementPill href="/records">Every reply now shows what your agent changed</AnnouncementPill>
            {/* The line changes with the hour, so it lands on the client (see useGreeting). */}
            <h1 className="text-balance text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
              {greeting}
            </h1>
          </div>

          <ComposerWithAttachments
            id="new-agent-task"
            label="Describe the task for a new agent"
            value={task}
            onChange={setTask}
            onSubmit={async (value, images) => Boolean(await create(value, images, { send: true }))}
            submitting={creating}
            submitLabel="Create agent"
            placeholder="Describe a task to hand off…"
            className="w-full"
          />

          <SuggestionChips variant="pills" onPick={startNow} disabled={creating} />
        </section>

        {/* Two rows is enough to start from; the whole catalogue lives on Workbench → Workflows. */}
        <IdeaBrowser onPick={pickIdea} limit={6} moreHref="/agents/workbench" disabled={creating} />
      </div>
    </div>
  );
}
