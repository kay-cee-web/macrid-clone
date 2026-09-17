import { PLATFORMS } from "@/data/platforms";
import { readinessOf, type CategorizedIdea } from "@/data/ideas";
import { useWorkspaceSetup } from "@/hooks/useWorkspaceSetup";
import type { Idea } from "@/types/idea";
import { IdeaCover } from "./IdeaCover";

type IdeaCardProps = {
  idea: CategorizedIdea;
  onPick: (idea: Idea) => void;
  /** Spoken name of what picking does, e.g. "Draft" or "Send to chat". */
  action?: string;
};

/** A standing task as a template tile: cover art, then the title and the platforms it uses. */
export function IdeaCard({ idea, onPick, action = "Use" }: IdeaCardProps) {
  const readiness = readinessOf(idea, useWorkspaceSetup());

  return (
    <button
      type="button"
      onClick={() => onPick(idea)}
      aria-label={`${action}: ${idea.title}. ${idea.description}`}
      className="group grid content-start gap-3 rounded-2xl text-left focus-visible:outline-offset-4"
    >
      <IdeaCover idea={idea} category={idea.category} readiness={readiness} />
      <span className="flex min-w-0 items-center gap-3 px-1">
        <span className="min-w-0 flex-1 truncate text-base font-medium text-ink group-hover:text-accent">
          {idea.title}
        </span>
        {idea.platforms.length > 0 && (
          <span className="flex shrink-0 items-center gap-1.5 text-muted">
            {idea.platforms.map((id) => {
              const { name, Icon } = PLATFORMS[id];
              return (
                <span key={id} title={name}>
                  <Icon aria-hidden className="size-4" />
                </span>
              );
            })}
          </span>
        )}
      </span>
    </button>
  );
}
