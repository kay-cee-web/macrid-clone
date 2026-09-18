import type { AiProviderId } from "@/types/aiKey";

/**
 * The model catalogue (text models are the same list as Macrid's lib/aiModels.js).
 * Every id is sent to the provider verbatim. Retired models stay, tagged
 * `legacy`, so an agent already saved on one still resolves.
 *
 * Only `text` models can run an agent: `PUT /agents/{id} {model}` is the thinking
 * model, and no agent tool generates media. Image and video models are here so a
 * workspace can hold the key for them — `TEXT_MODEL_GROUPS` is what Settings offers.
 */
export type ModelTag = "latest" | "fast" | "stable" | "legacy";
export type ModelKind = "text" | "image" | "video";
export type ModelOption = {
  id: string;
  name: string;
  note: string;
  tag: ModelTag;
  /** Context window for text; the output ceiling ("4K", "1080p · 10s") for media. */
  spec: string;
  kind: ModelKind;
  provider: AiProviderId;
};
export type ModelGroup = { label: string; provider: AiProviderId; models: ModelOption[] };

type Row = [id: string, name: string, tag: ModelTag, spec: string, note: string, kind?: ModelKind];
const group = (provider: AiProviderId, label: string, rows: Row[]): ModelGroup => ({
  label,
  provider,
  models: rows.map(([id, name, tag, spec, note, kind = "text"]) => ({ id, name, tag, spec, note, kind, provider })),
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
    ["gpt-image-1.5", "GPT Image 1.5", "latest", "4K", "Product shots and legible text", "image"],
    ["gpt-image-1-mini", "GPT Image 1 Mini", "fast", "2K", "Quick drafts and variations", "image"],
    ["sora-2-pro", "Sora 2 Pro", "latest", "1080p · 20s", "Cinematic video with sound", "video"],
    ["sora-2", "Sora 2", "stable", "720p · 10s", "Everyday video with sound", "video"],
    ["o3", "o3", "legacy", "200K", "Superseded reasoning"],
    ["o4-mini", "o4-mini", "legacy", "200K", "Superseded fast reasoning"],
    ["gpt-4o", "GPT-4o", "legacy", "128K", "Previous multimodal"],
    ["gpt-4o-mini", "GPT-4o mini", "legacy", "128K", "Previous fast"],
    ["gpt-4-turbo", "GPT-4 Turbo", "legacy", "128K", "Legacy flagship"],
    ["gpt-3.5-turbo", "GPT-3.5 Turbo", "legacy", "16K", "Legacy fast"],
    ["dall-e-3", "DALL·E 3", "legacy", "1K", "Superseded image model", "image"],
  ]),
  group("gemini", "Google Gemini", [
    ["gemini-3-pro", "Gemini 3 Pro", "latest", "1M", "Most capable"],
    ["gemini-3-flash", "Gemini 3 Flash", "fast", "1M", "Fast & efficient"],
    ["gemini-2.5-pro", "Gemini 2.5 Pro", "stable", "1M", "Previous flagship"],
    ["gemini-2.5-flash", "Gemini 2.5 Flash", "stable", "1M", "Previous fast"],
    ["gemini-3-pro-image", "Nano Banana Pro", "latest", "4K", "Edits an image as you talk", "image"],
    ["imagen-4-ultra", "Imagen 4 Ultra", "latest", "2K", "Highest-fidelity stills", "image"],
    ["imagen-4-fast", "Imagen 4 Fast", "fast", "1K", "Cheap bulk stills", "image"],
    ["veo-3.1", "Veo 3.1", "latest", "1080p · 8s", "Video with native audio", "video"],
    ["veo-3.1-fast", "Veo 3.1 Fast", "fast", "720p · 8s", "Fast video drafts", "video"],
    ["gemini-1.5-pro", "Gemini 1.5 Pro", "legacy", "2M", "Legacy long context"],
    ["gemini-1.5-flash", "Gemini 1.5 Flash", "legacy", "1M", "Legacy fast"],
  ]),
  group("blackforest", "Black Forest Labs", [
    ["flux-2-pro", "FLUX.2 Pro", "latest", "4MP", "Sharp brand and product stills", "image"],
    ["flux-2-flex", "FLUX.2 Flex", "stable", "4MP", "Quality traded against speed", "image"],
    ["flux-2-klein", "FLUX.2 Klein", "fast", "2MP", "Cheapest & fastest", "image"],
    ["flux-kontext-pro", "FLUX Kontext Pro", "stable", "4MP", "Edits a still from instructions", "image"],
  ]),
  group("runway", "Runway", [
    ["gen-4-turbo", "Gen-4 Turbo", "latest", "1080p · 10s", "Fast shots that stay consistent", "video"],
    ["gen-4-aleph", "Gen-4 Aleph", "latest", "1080p · 5s", "Restyles and edits a clip", "video"],
    ["gen-4-image", "Gen-4 Image", "stable", "2K", "Stills from reference images", "image"],
  ]),
  group("luma", "Luma AI", [
    ["ray-3", "Ray 3", "latest", "1080p · 10s", "HDR video from text or a still", "video"],
    ["photon-2", "Photon 2", "stable", "2K", "Stills that hold a look", "image"],
  ]),
];

export const ALL_MODELS = MODEL_GROUPS.flatMap((g) => g.models);

/** Agents run on text models only, so this is what the model picker offers. */
export const TEXT_MODEL_GROUPS = MODEL_GROUPS.map((g) => ({ ...g, models: g.models.filter((m) => m.kind === "text") })).filter(
  (g) => g.models.length > 0,
);

export const TAG_LABELS: Record<ModelTag, string> = { latest: "Latest", fast: "Fast", stable: "Stable", legacy: "Retired" };
export const KIND_LABELS: Record<ModelKind, string> = { text: "Text", image: "Image", video: "Video" };

export const isKnownModel = (id: string) => ALL_MODELS.some((model) => model.id === id);

export const modelName = (id: string | null | undefined) =>
  (id && ALL_MODELS.find((model) => model.id === id)?.name) || id || "";
