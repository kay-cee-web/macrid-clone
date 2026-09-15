/** Models an agent can run on (same catalogue as Macrid's lib/aiModels.js). */
export type ModelOption = { id: string; name: string; note: string };
export type ModelGroup = { label: string; models: ModelOption[] };

export const MODEL_GROUPS: ModelGroup[] = [
  {
    label: "Anthropic Claude",
    models: [
      { id: "claude-opus-5", name: "Claude Opus 5", note: "Most powerful" },
      { id: "claude-sonnet-5", name: "Claude Sonnet 5", note: "Best balance" },
      { id: "claude-fable-5", name: "Claude Fable 5", note: "Creative writing" },
      { id: "claude-mythos-5", name: "Claude Mythos 5", note: "Long-form narrative" },
      { id: "claude-opus-4-8", name: "Claude Opus 4.8", note: "Previous flagship" },
      { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", note: "Fastest & cheapest" },
      { id: "claude-opus-4-5", name: "Claude Opus 4.5", note: "Superseded flagship" },
      { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5", note: "Superseded balanced" },
      { id: "claude-opus-4", name: "Claude Opus 4", note: "Legacy flagship" },
      { id: "claude-sonnet-4", name: "Claude Sonnet 4", note: "Legacy balanced" },
      { id: "claude-haiku-3-5", name: "Claude Haiku 3.5", note: "Legacy fast" },
    ],
  },
  {
    label: "OpenAI",
    models: [
      { id: "gpt-5.6-sol", name: "GPT-5.6 Sol", note: "Flagship reasoning" },
      { id: "gpt-5.6-terra", name: "GPT-5.6 Terra", note: "Flagship balanced" },
      { id: "gpt-5.3-codex", name: "GPT-5.3 Codex", note: "Code & agentic work" },
      { id: "gpt-5.2-pro", name: "GPT-5.2 Pro", note: "Deep reasoning" },
      { id: "gpt-5.2", name: "GPT-5.2", note: "General purpose" },
      { id: "gpt-5.1", name: "GPT-5.1", note: "Previous generation" },
      { id: "gpt-5-pro", name: "GPT-5 Pro", note: "Extended reasoning" },
      { id: "gpt-5", name: "GPT-5", note: "Previous flagship" },
      { id: "gpt-5-mini", name: "GPT-5 Mini", note: "Affordable & fast" },
      { id: "gpt-5-nano", name: "GPT-5 Nano", note: "Cheapest & fastest" },
      { id: "gpt-4.1", name: "GPT-4.1", note: "Long context" },
      { id: "gpt-4.1-mini", name: "GPT-4.1 Mini", note: "Long context, fast" },
      { id: "o3", name: "o3", note: "Superseded reasoning" },
      { id: "o4-mini", name: "o4-mini", note: "Superseded fast reasoning" },
      { id: "gpt-4o", name: "GPT-4o", note: "Previous multimodal" },
      { id: "gpt-4o-mini", name: "GPT-4o mini", note: "Previous fast" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", note: "Legacy flagship" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", note: "Legacy fast" },
    ],
  },
  {
    label: "Google Gemini",
    models: [
      { id: "gemini-3-pro", name: "Gemini 3 Pro", note: "Most capable" },
      { id: "gemini-3-flash", name: "Gemini 3 Flash", note: "Fast & efficient" },
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", note: "Previous flagship" },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", note: "Previous fast" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", note: "Legacy long context" },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", note: "Legacy fast" },
    ],
  },
];

const ALL_MODELS = MODEL_GROUPS.flatMap((group) => group.models);

export const isKnownModel = (id: string) => ALL_MODELS.some((model) => model.id === id);

export const modelName =(id: string | null | undefined) =>
  (id && ALL_MODELS.find((model) => model.id === id)?.name) || id || "";
