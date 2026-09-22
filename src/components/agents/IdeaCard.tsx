"use client";

import type { ReactNode } from "react";
import { CircleCheck, CircleDashed, PlugZap } from "lucide-react";
import { Pill } from "@/components/ui/Pill";
import { readinessOf, type CategorizedIdea } from "@/data/ideas";
import { useWorkspaceSetup } from "@/hooks/useWorkspaceSetup";
import { cn } from "@/lib/cn";
import { connectorsFor } from "@/lib/setup/connectorsFor";
import type { Idea } from "@/types/idea";
import { AgentIcon } from "./AgentIcon";
import { IdeaCover } from "./IdeaCover";
import { PlatformLogos } from "./PlatformLogos";

type IdeaCardProps = {
  idea: CategorizedIdea;
  onPick: (idea: Idea) => void;
  /** Spoken name of what picking does, e.g. "Start" or "Send to chat". */
  action?: string;
  /** "cover" is the artwork tile used on home and Workflows; "card" takes `AgentCard`'s shape. */
  variant?: "cover" | "card";
  /** While a pick is being acted on (an agent being created), so a second click can't make a second one. */
  disabled?: boolean;
};

type PickButtonProps = {
  label: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  rounded: string;
  children: ReactNode;
};

/** The title, stretched over the whole card as its one action; the connector logos sit above it. */
function PickButton({ label, title, onClick, disabled, rounded, children }: PickButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={title}
      className={cn(
        "block w-full truncate text-left after:absolute after:inset-0 focus-visible:outline-none",
        "focus-visible:after:ring-2 focus-visible:after:ring-accent",
        rounded,
      )}
    >
      {children}
    </button>
  );
}

/**
 * A standing task, as the artwork tile (`cover`) that home and Workflows show,
 * or as a plain card built to `AgentCard`'s shape. Both are an `<article>`
 * whose title button covers the card, so the logos can be buttons of their own.
 */
export function IdeaCard({ idea, onPick, action = "Use", variant = "cover", disabled }: IdeaCardProps) {
  const setup = useWorkspaceSetup();
  const readiness = readinessOf(idea, setup);
  const StatusIcon = readiness.ready ? CircleCheck : readiness.tone === "warn" ? PlugZap : CircleDashed;
  const connectors = connectorsFor(idea.platforms, setup);
  const pick = { label: `${action}: ${idea.title}. ${idea.description}`, title: readiness.reason, onClick: () => onPick(idea), disabled };

  if (variant === "cover") {
    return (
      <article
        data-disabled={disabled || undefined}
        className="group relative grid content-start gap-3 transition-opacity data-disabled:opacity-60"
      >
        <IdeaCover idea={idea} category={idea.category} readiness={readiness} />
        <div className="flex min-w-0 items-center gap-3 px-1">
          <h3 className="min-w-0 flex-1 font-sans text-base font-medium tracking-normal text-ink group-hover:text-accent">
            <PickButton {...pick} rounded="after:rounded-2xl">{idea.title}</PickButton>
          </h3>
          <PlatformLogos items={connectors} />
        </div>
      </article>
    );
  }

  return (
    <article
      data-disabled={disabled || undefined}
      className="group relative grid h-full content-start gap-8 rounded-3xl border border-line bg-raised/40 p-6 backdrop-blur transition-[background-color,box-shadow,opacity] duration-200 hover:bg-raised/80 hover:shadow-float data-disabled:opacity-60"
    >
      <div className="flex items-start justify-between gap-3">
        <AgentIcon category={idea.category} />
        <Pill tone={readiness.tone} className="min-w-0">
          <StatusIcon aria-hidden className="size-3.5 shrink-0" />
          <span className="truncate">{readiness.label}</span>
        </Pill>
      </div>

      <div className="grid gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.06em] text-faint">{idea.category}</span>
        <div className="flex min-w-0 items-center gap-2.5">
          <h3 className="min-w-0 flex-1 text-xl text-ink group-hover:text-accent">
            <PickButton {...pick} rounded="after:rounded-3xl">{idea.title}</PickButton>
          </h3>
          <PlatformLogos items={connectors} />
        </div>
        <p className="line-clamp-2 min-h-13 text-base leading-relaxed text-muted">{idea.description}</p>
      </div>
    </article>
  );
}
