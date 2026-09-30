import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Pill } from "@/components/ui/Pill";
import { buttonStyles } from "@/components/ui/button-styles";
import { linkFor, linkLabelFor } from "@/lib/briefing/links";
import type { BriefingNeed } from "@/types/briefing";

/**
 * One thing that needs the user today.
 *
 * The coloured left edge is the only one in the briefing: `Today` and `Worth
 * knowing` stay quiet so this section reads as the urgent one at a glance. The
 * source is a neutral pill rather than a colour per vendor — a coloured badge
 * beside an urgent item reads as severity, and provenance is not severity.
 */
export function NeedCard({ need }: { need: BriefingNeed }) {
  const href = linkFor(need);
  const label = linkLabelFor(need);

  return (
    <article className="grid gap-2 rounded-[14px] border border-line border-l-2 border-l-bad bg-surface p-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {need.source && <Pill>{need.source}</Pill>}
        {/* Why it is here *today*. Never dropped — without it the user has to work out the urgency themselves. */}
        {need.why && <span className="text-xs text-muted">{need.why}</span>}
      </div>

      <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-ink">{need.title}</h3>
      {need.body && <p className="text-sm leading-relaxed text-muted">{need.body}</p>}

      {href && (
        <div className="mt-1">
          <Link href={href} className={buttonStyles({ variant: "secondary", size: "sm" })}>
            {label}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </article>
  );
}
