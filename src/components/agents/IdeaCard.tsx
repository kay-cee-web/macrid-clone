import { PLATFORMS } from "@/data/platforms";
import { readinessOf } from "@/data/ideas";
import { Pill } from "@/components/ui/Pill";
import { useWorkspaceSetup } from "@/hooks/useWorkspaceSetup";
import type { Idea } from "@/types/idea";

type IdeaCardProps = {
  idea: Idea;
  onPick: (idea: Idea) => void;
  /** Small label naming what picking does, e.g. the category or "Send to chat". */
  eyebrow?: string;
};

/** A standing task. What picking does is up to the caller. */
export function IdeaCard({ idea, onPick, eyebrow }: IdeaCardProps) {
  const readiness = readinessOf(idea, useWorkspaceSetup());

  return (
    <button
      type="button"
      onClick={() => onPick(idea)}
      className="group grid content-start gap-2 bg-surface p-4 text-left transition-colors hover:bg-raised focus-visible:z-10"
    >
      {eyebrow && (
        <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-faint">{eyebrow}</span>
      )}
      <h3 className="text-[15px] font-semibold leading-snug text-ink">{idea.title}</h3>
      <p className="line-clamp-3 text-[13px] leading-relaxed text-muted">{idea.description}</p>
      <div className="mt-1 flex flex-wrap items-center gap-1.5">
        {idea.platforms.map((id) => {
          const { name, Icon } = PLATFORMS[id];
          return (
            <span
              key={id}
              className="inline-flex items-center gap-1 rounded-md border border-line bg-raised px-1.5 py-1 text-[11.5px] text-muted"
            >
              <Icon aria-hidden className="size-3" />
              {name}
            </span>
          );
        })}
        <span title={readiness.reason} className="ml-auto">
          <Pill tone={readiness.tone} dot={readiness.tone !== "neutral"}>
            {readiness.label}
          </Pill>
        </span>
      </div>
    </button>
  );
}
