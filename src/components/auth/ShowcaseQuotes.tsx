"use client";

import { useEffect, useState } from "react";
import { AgentAvatar } from "@/components/agents/AgentAvatar";
import { Eyebrow } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";
import { SHOWCASE_RUNS } from "@/data/showcase";

const HOLD_MS = 7000;

/** The rotating card on the sign-in artwork: one example run at a time. */
export function ShowcaseQuotes() {
  const [index, setIndex] = useState(0);
  const run = SHOWCASE_RUNS[index];

  // Keyed on index, so picking a dot restarts the hold rather than cutting it short.
  useEffect(() => {
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % SHOWCASE_RUNS.length), HOLD_MS);
    return () => window.clearTimeout(id);
  }, [index]);

  return (
    <figure className="grid min-h-64 w-full max-w-lg content-start gap-5 rounded-[20px] border border-line/70 bg-surface/70 p-6 shadow-float backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Eyebrow>Example run</Eyebrow>
        <Pill tone={run.tone} dot className="ml-auto">
          {run.area}
        </Pill>
      </div>

      <blockquote key={index} className="animate-fade-in text-lg leading-relaxed text-ink">
        “{run.quote}”
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3">
        <AgentAvatar name={run.agent} />
        <div className="leading-tight">
          <div className="text-sm font-medium">{run.agent}</div>
          <div className="text-xs text-muted">{run.role}</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          {SHOWCASE_RUNS.map((item, i) => (
            <button
              key={item.agent}
              type="button"
              aria-label={`Show ${item.agent}'s run`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-accent" : "w-1.5 bg-line hover:bg-faint",
              )}
            />
          ))}
        </div>
      </figcaption>
    </figure>
  );
}
