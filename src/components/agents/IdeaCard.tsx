"use client";

import { CircleCheck, CircleDashed, PlugZap } from "lucide-react";
import { Pill } from "@/components/ui/Pill";
import { readinessOf, type CategorizedIdea } from "@/data/ideas";
import { PLATFORMS } from "@/data/platforms";
import { useWorkspaceSetup } from "@/hooks/useWorkspaceSetup";
import type { Idea } from "@/types/idea";
import { AgentIcon } from "./AgentIcon";
import { IdeaCover } from "./IdeaCover";

/** The services the task touches, as quiet glyphs. */
function PlatformIcons({ idea }: { idea: Idea }) {
  if (idea.platforms.length === 0) return null;
  return (
    <span className="flex shrink-0 items-center gap-1.5 text-faint">
      {idea.platforms.map((id) => {
        const { name, Icon } = PLATFORMS[id];
        return (
          <span key={id} title={name}>
            <Icon aria-hidden className="size-4" />
          </span>
        );
      })}
    </span>
  );
}

type IdeaCardProps = {
  idea: CategorizedIdea;
  onPick: (idea: Idea) => void;
  /** Spoken name of what picking does, e.g. "Draft" or "Send to chat". */
  action?: string;
  /** "cover" is the artwork tile used on home and Workflows; "card" takes `AgentCard`'s shape. */
  variant?: "cover" | "card";
};

/**
 * A standing task, as the artwork tile (`cover`) that home and Workflows show,
 * or as a plain card built to `AgentCard`'s shape.
 */
export function IdeaCard({ idea, onPick, action = "Use", variant = "cover" }: IdeaCardProps) {
  const readiness = readinessOf(idea, useWorkspaceSetup());
  const StatusIcon = readiness.ready ? CircleCheck : readiness.tone === "warn" ? PlugZap : CircleDashed;
  const label = `${action}: ${idea.title}. ${idea.description}`;

  if (variant === "cover") {
    return (
      <button
        type="button"
        onClick={() => onPick(idea)}
        aria-label={label}
        className="group grid content-start gap-3 rounded-2xl text-left focus-visible:outline-offset-4"
      >
        <IdeaCover idea={idea} category={idea.category} readiness={readiness} />
        <span className="flex min-w-0 items-center gap-3 px-1">
          <span className="min-w-0 flex-1 truncate text-base font-medium text-ink group-hover:text-accent">
            {idea.title}
          </span>
          <PlatformIcons idea={idea} />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onPick(idea)}
      aria-label={label}
      className="group grid h-full content-start gap-8 rounded-3xl border border-line bg-raised/40 p-6 text-left backdrop-blur transition-[background-color,box-shadow] duration-200 hover:bg-raised/80 hover:shadow-float focus-visible:outline-offset-4"
    >
      <div className="flex items-start justify-between gap-3">
        <AgentIcon category={idea.category} />
        <span title={readiness.reason} className="min-w-0">
          <Pill tone={readiness.tone}>
            <StatusIcon aria-hidden className="size-3.5 shrink-0" />
            <span className="truncate">{readiness.label}</span>
          </Pill>
        </span>
      </div>

      <div className="grid gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.06em] text-faint">{idea.category}</span>
        <h3 className="flex min-w-0 items-center gap-2.5 text-xl text-ink group-hover:text-accent">
          <span className="min-w-0 flex-1 truncate">{idea.title}</span>
          <PlatformIcons idea={idea} />
        </h3>
        <p className="line-clamp-2 min-h-13 text-base leading-relaxed text-muted">{idea.description}</p>
      </div>
    </button>
  );
}
