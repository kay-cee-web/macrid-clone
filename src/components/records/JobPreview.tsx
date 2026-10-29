import { AudioLines, FileText, Film, Music, Sparkles } from "lucide-react";
import type { ModelJob } from "@/types/modelJob";

const ICONS = { video: Film, music: Music, speech: AudioLines, script: FileText };
const FRAME = "grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-raised ring-1 ring-inset ring-line";

/** A thumbnail for an image result; the category's glyph for anything else or nothing yet. */
export function JobPreview({ job }: { job: ModelJob }) {
  const file = job.files[0];
  if (job.category === "image" && file) {
    return (
      <span className={FRAME}>
        {/* eslint-disable-next-line @next/next/no-img-element -- hosted results on another domain */}
        <img src={file} alt="" loading="lazy" className="size-full object-cover" />
      </span>
    );
  }
  const Icon = ICONS[job.category as keyof typeof ICONS] ?? Sparkles;
  return (
    <span className={FRAME}>
      <Icon className="size-5 text-muted" />
    </span>
  );
}
