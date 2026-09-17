"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AnnouncementPill } from "@/components/ui/AnnouncementPill";
import { buttonStyles } from "@/components/ui/button-styles";
import { TokenBalance } from "@/components/workspace/TokenBalance";
import { ComposerWithAttachments } from "@/components/chat/ComposerWithAttachments";
import { SuggestionChips } from "@/components/chat/SuggestionChips";
import { useCreateAgent } from "@/hooks/useCreateAgent";
import { dexisphereAppLink } from "@/lib/config";
import type { Idea } from "@/types/idea";
import { IdeaBrowser } from "./IdeaBrowser";

const PILL = "h-10 rounded-full border border-line bg-surface/80 px-4 shadow-float backdrop-blur";

export function AgentsHome() {
  const searchParams = useSearchParams();
  const [task, setTask] = useState(() => searchParams.get("task") ?? "");
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const { create, creating } = useCreateAgent();

  const draft = (text: string) => {
    setTask(text);
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    composerRef.current?.focus({ preventScroll: true });
  };
  const pickIdea = (idea: Idea) => draft(idea.description);

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

      <div className="mx-auto grid w-full max-w-5xl gap-24 px-4 pb-20 pt-12 sm:px-8 lg:pt-[10vh]">
        <section className="mx-auto grid w-full max-w-3xl justify-items-center gap-10">
          <div className="grid justify-items-center gap-8 text-center">
            <AnnouncementPill href="/records">Every reply now shows what your agent changed</AnnouncementPill>
            <h1 className="text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
              What should your agent do today?
            </h1>
          </div>

          <ComposerWithAttachments
            id="new-agent-task"
            label="Describe the task for a new agent"
            textareaRef={composerRef}
            value={task}
            onChange={setTask}
            onSubmit={async (value, images) => Boolean(await create(value, images))}
            submitting={creating}
            submitLabel="Create agent"
            placeholder="Describe the work you'd otherwise do by hand, e.g. find 40 dental clinics in Austin with no website…"
            className="w-full"
          />

          <SuggestionChips variant="pills" onPick={draft} />
        </section>

        <IdeaBrowser onPick={pickIdea} />
      </div>
    </div>
  );
}
