import { COVERS } from "@/data/ideas/covers";
import { cn } from "@/lib/cn";
import type { IdeaCategory } from "@/types/idea";

/** A round, category-coloured icon badge for an agent card. */
export function AgentIcon({ category, className }: { category: IdeaCategory; className?: string }) {
  const { Icon, tint } = COVERS[category];
  return (
    <span
      aria-hidden
      title={category}
      className={cn("grid size-12 shrink-0 place-items-center rounded-full text-surface shadow-float", tint, className)}
    >
      <Icon className="size-5" strokeWidth={2} />
    </span>
  );
}
