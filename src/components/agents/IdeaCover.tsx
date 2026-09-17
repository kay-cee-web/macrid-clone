import { CircleCheck, CircleDashed, PlugZap } from "lucide-react";
import type { Readiness } from "@/data/ideas";
import { COVERS, leadOf } from "@/data/ideas/covers";
import { cn } from "@/lib/cn";
import type { Idea, IdeaCategory } from "@/types/idea";

type IdeaCoverProps = {
  idea: Idea;
  category: IdeaCategory;
  readiness: Readiness;
};

/** Generated cover art for a standing task: category glow, headline, and readiness. */
export function IdeaCover({ idea, category, readiness }: IdeaCoverProps) {
  const { Icon, glow } = COVERS[category];
  const lead = leadOf(idea);
  const rest = lead === idea.title ? idea.description : idea.description.slice(lead.length + 2);
  const StatusIcon = readiness.ready ? CircleCheck : readiness.tone === "warn" ? PlugZap : CircleDashed;

  return (
    <div className="@container relative aspect-16/10 overflow-hidden rounded-2xl bg-night shadow-float ring-1 ring-line">
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-radial-[at_15%_0%] to-transparent to-75% opacity-90 transition-transform duration-500 group-hover:scale-110",
          glow,
        )}
      />
      <div aria-hidden className="absolute inset-0 bg-radial-[at_100%_100%] from-night-ink/10 to-transparent to-50%" />
      <Icon
        aria-hidden
        strokeWidth={1}
        className="absolute -bottom-8 -right-6 size-44 text-night-ink/10 transition-transform duration-500 group-hover:-rotate-6"
      />

      <div className="relative flex h-full flex-col justify-between p-4 @sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-night-ink/75">{category}</span>
          <span
            title={readiness.reason}
            className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-night/45 px-2.5 py-1 text-xs text-night-ink backdrop-blur"
          >
            <StatusIcon aria-hidden className="size-3.5 shrink-0" />
            <span className="truncate">{readiness.label}</span>
          </span>
        </div>

        <div className="grid max-w-[88%] gap-2">
          <p className="line-clamp-2 font-display text-xl font-medium @sm:text-2xl leading-tight tracking-tight text-night-ink">
            {lead}
          </p>
          <p className="line-clamp-2 text-xs leading-snug text-night-ink/70 first-letter:uppercase @sm:text-sm">{rest}</p>
        </div>
      </div>
    </div>
  );
}
