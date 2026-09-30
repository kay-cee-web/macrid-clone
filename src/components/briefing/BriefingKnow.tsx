import { cn } from "@/lib/cn";
import type { BriefingKnow as KnowItem, BriefingTone } from "@/types/briefing";
import { BriefingSection } from "./BriefingSection";

/**
 * Worth knowing: things that are true but need nothing done about them today.
 *
 * The quietest section by design — no card, no border, just a dot and a line.
 * It is the first thing a reader should be able to skip, which is what makes
 * the section above it mean something.
 */
const DOTS: Record<BriefingTone, string> = {
  neutral: "bg-muted",
  warn: "bg-warn",
  good: "bg-good",
};

export function BriefingKnow({ know }: { know: KnowItem[] }) {
  if (!know.length) return null;

  return (
    <BriefingSection title="Worth knowing" aside="no action needed">
      <ul className="grid gap-2.5">
        {know.map((item, index) => (
          <li key={`${index}:${item.text.slice(0, 32)}`} className="flex items-start gap-2.5">
            <span aria-hidden className={cn("mt-2 size-1.5 shrink-0 rounded-full", DOTS[item.tone])} />
            <p className="text-sm leading-relaxed text-muted">{item.text}</p>
          </li>
        ))}
      </ul>
    </BriefingSection>
  );
}
