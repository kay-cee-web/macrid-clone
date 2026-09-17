import { AI_PROVIDER_BY_ID } from "@/data/aiProviders";
import { cn } from "@/lib/cn";
import type { AiProviderId } from "@/types/aiKey";

/** The provider's mark on a light tile (the same in both themes, so dark logos stay visible). */
export function ProviderLogo({ provider, className }: { provider: AiProviderId; className?: string }) {
  const { glyph, tint } = AI_PROVIDER_BY_ID[provider];
  return (
    <span
      aria-hidden
      className={cn("grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-night-ink shadow-float", className)}
    >
      <svg viewBox="0 0 24 24" className={cn("size-1/2", tint)}>
        <path d={glyph} fill="currentColor" />
      </svg>
    </span>
  );
}
