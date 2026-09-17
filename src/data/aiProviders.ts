import type { AiProviderId } from "@/types/aiKey";

export type AiProvider = {
  id: AiProviderId;
  name: string;
  keyUrl: string;
  keyUrlLabel: string;
  keyPlaceholder: string;
  /** Single-path 24×24 logo glyph, drawn in `tint` on a light tile. */
  glyph: string;
  tint: string;
};

/** Providers a user can bring their own key for (same as Macrid's AI Keys settings). */
export const AI_PROVIDERS: AiProvider[] = [
  {
    id: "anthropic",
    name: "Anthropic",
    keyUrl: "https://console.anthropic.com/settings/keys",
    keyUrlLabel: "console.anthropic.com",
    keyPlaceholder: "sk-ant-api03-…",
    tint: "text-logo-anthropic",
    glyph: "M13.827 3.41L19.95 20h-3.41l-1.22-3.517H8.68L7.46 20H4.05L10.173 3.41h3.654zM12 7.664l-2.34 6.727h4.68L12 7.664z",
  },
  {
    id: "openai",
    name: "OpenAI",
    keyUrl: "https://platform.openai.com/api-keys",
    keyUrlLabel: "platform.openai.com",
    keyPlaceholder: "sk-proj-…",
    tint: "text-night",
    glyph:
      "M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.032.067L9.808 19.9a4.5 4.5 0 0 1-6.208-1.597zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0L4.06 14.2a4.504 4.504 0 0 1-1.72-6.304zm16.597 3.855l-5.843-3.372 2.02-1.163a.076.076 0 0 1 .071 0l4.757 2.746a4.5 4.5 0 0 1-.676 8.115v-5.677a.79.79 0 0 0-.329-.649zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.76-2.744a4.5 4.5 0 0 1 6.684 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    keyUrl: "https://aistudio.google.com/app/apikey",
    keyUrlLabel: "aistudio.google.com",
    keyPlaceholder: "AIza…",
    tint: "text-logo-gemini",
    glyph: "M12 24A14.304 14.304 0 0 0 0 12 14.304 14.304 0 0 0 12 0a14.305 14.305 0 0 0 12 12 14.305 14.305 0 0 0-12 12z",
  },
];

export const AI_PROVIDER_BY_ID = Object.fromEntries(AI_PROVIDERS.map((p) => [p.id, p])) as Record<AiProviderId, AiProvider>;
