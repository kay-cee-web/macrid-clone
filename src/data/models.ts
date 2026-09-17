import type { AiProviderId } from "@/types/aiKey";

/**
 * Models an agent can run on (same catalogue as Macrid's lib/aiModels.js).
 * Every id is sent to the provider verbatim. Retired models stay, tagged
 * `legacy`, so an agent already saved on one still resolves.
 */
export type ModelTag = "latest" | "fast" | "stable" | "legacy";
export type ModelOption = { id: string; name: string; note: string; tag: ModelTag; context: string; provider: AiProviderId };
export type ModelGroup = { label: string; provider: AiProviderId; models: ModelOption[] };

type Row = [id: string, name: string, tag: ModelTag, context: string, note: string];
const group = (provider: AiProviderId, label: string, rows: Row[]): ModelGroup => ({
  label,
  provider,
  models: rows.map(([id, name, tag, context, note]) => ({ id, name, tag, context, note, provider })),
});

export const MODEL_GROUPS: ModelGroup[] = [
  group("anthropic", "Anthropic Claude", [
    ["claude-opus-5", "Claude Opus 5", "latest", "200K", "Most powerful"],
    ["claude-sonnet-5", "Claude Sonnet 5", "latest", "200K", "Best balance"],
    ["claude-fable-5", "Claude Fable 5", "latest", "200K", "Creative writing"],
    ["claude-mythos-5", "Claude Mythos 5", "latest", "200K", "Long-form narrative"],
    ["claude-opus-4-8", "Claude Opus 4.8", "stable", "200K", "Previous flagship"],
    ["claude-haiku-4-5", "Claude Haiku 4.5", "fast", "200K", "Fastest & cheapest"],
    ["claude-opus-4-5", "Claude Opus 4.5", "legacy", "200K", "Superseded flagship"],
    ["claude-sonnet-4-5", "Claude Sonnet 4.5", "legacy", "200K", "Superseded balanced"],
    ["claude-opus-4", "Claude Opus 4", "legacy", "200K", "Legacy flagship"],
    ["claude-sonnet-4", "Claude Sonnet 4", "legacy", "200K", "Legacy balanced"],
    ["claude-haiku-3-5", "Claude Haiku 3.5", "legacy", "200K", "Legacy fast"],
  ]),
  group("openai", "OpenAI", [
    ["gpt-5.6-sol", "GPT-5.6 Sol", "latest", "400K", "Flagship reasoning"],
    ["gpt-5.6-terra", "GPT-5.6 Terra", "latest", "400K", "Flagship balanced"],
    ["gpt-5.3-codex", "GPT-5.3 Codex", "latest", "400K", "Code & agentic work"],
    ["gpt-5.2-pro", "GPT-5.2 Pro", "stable", "400K", "Deep reasoning"],
    ["gpt-5.2", "GPT-5.2", "stable", "400K", "General purpose"],
    ["gpt-5.1", "GPT-5.1", "stable", "400K", "Previous generation"],
    ["gpt-5-pro", "GPT-5 Pro", "stable", "400K", "Extended reasoning"],
    ["gpt-5", "GPT-5", "stable", "400K", "Previous flagship"],
    ["gpt-5-mini", "GPT-5 Mini", "fast", "400K", "Affordable & fast"],
    ["gpt-5-nano", "GPT-5 Nano", "fast", "400K", "Cheapest & fastest"],
    ["gpt-4.1", "GPT-4.1", "stable", "1M", "Long context"],
    ["gpt-4.1-mini", "GPT-4.1 Mini", "fast", "1M", "Long context, fast"],
    ["o3", "o3", "legacy", "200K", "Superseded reasoning"],
    ["o4-mini", "o4-mini", "legacy", "200K", "Superseded fast reasoning"],
    ["gpt-4o", "GPT-4o", "legacy", "128K", "Previous multimodal"],
    ["gpt-4o-mini", "GPT-4o mini", "legacy", "128K", "Previous fast"],
    ["gpt-4-turbo", "GPT-4 Turbo", "legacy", "128K", "Legacy flagship"],
    ["gpt-3.5-turbo", "GPT-3.5 Turbo", "legacy", "16K", "Legacy fast"],
  ]),
  group("gemini", "Google Gemini", [
    ["gemini-3-pro", "Gemini 3 Pro", "latest", "1M", "Most capable"],
    ["gemini-3-flash", "Gemini 3 Flash", "fast", "1M", "Fast & efficient"],
    ["gemini-2.5-pro", "Gemini 2.5 Pro", "stable", "1M", "Previous flagship"],
    ["gemini-2.5-flash", "Gemini 2.5 Flash", "stable", "1M", "Previous fast"],
    ["gemini-1.5-pro", "Gemini 1.5 Pro", "legacy", "2M", "Legacy long context"],
    ["gemini-1.5-flash", "Gemini 1.5 Flash", "legacy", "1M", "Legacy fast"],
  ]),
];

export const ALL_MODELS = MODEL_GROUPS.flatMap((g) => g.models);

export const TAG_LABELS: Record<ModelTag, string> = { latest: "Latest", fast: "Fast", stable: "Stable", legacy: "Retired" };

export const isKnownModel = (id: string) => ALL_MODELS.some((model) => model.id === id);

export const modelName = (id: string | null | undefined) =>
  (id && ALL_MODELS.find((model) => model.id === id)?.name) || id || "";
