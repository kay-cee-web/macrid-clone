"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eyebrow } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { useCreateAgent } from "@/hooks/useCreateAgent";
import { firstName, greetingFor } from "@/lib/format";
import type { Idea } from "@/types/idea";
import { IdeaBrowser } from "./IdeaBrowser";
import { ComposerWithAttachments } from "@/components/chat/ComposerWithAttachments";

export function AgentsHome() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [task, setTask] = useState(() => searchParams.get("task") ?? "");
  const [greeting] = useState(() => greetingFor());
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const { create, creating } = useCreateAgent();
  const name = firstName(user?.name);

  const pickIdea = (idea: Idea) => {
    setTask(idea.description);
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    composerRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-14 px-4 pb-20 pt-10 sm:px-8 lg:pt-16">
      <section className="mx-auto grid w-full max-w-3xl gap-5">
        <div className="grid gap-3">
          <Eyebrow>
            {greeting}
            {name && `, ${name}`}
          </Eyebrow>
          <h1 className="max-w-[20ch] text-[34px] font-semibold leading-[1.05] sm:text-[44px]">
            What should an agent take off your plate?
          </h1>
          <p className="max-w-[60ch] text-[15px] text-muted">
            Describe the work you&apos;d otherwise do by hand in Macrid. A new agent takes it as its brief,
            and you can refine it in chat.
          </p>
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
          placeholder="e.g. Every Monday, find 40 dental clinics in Austin with no website and draft a WhatsApp opener for each."
        />
      </section>

      <IdeaBrowser onPick={pickIdea} />
    </div>
  );
}
