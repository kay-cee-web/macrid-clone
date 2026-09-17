import { isAxiosError } from "axios";
import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { toText } from "@/lib/api/pick";
import { readRows } from "@/lib/connections/readState";
import { AI_PROVIDER_IDS, type AiKeys, type AiKeyState, type AiProviderId } from "@/types/aiKey";
import { savePlatformKeys } from "./connections";

/**
 * The user's own AI provider keys (same stores as Macrid's lib/aiKeyStore.js).
 * Keys are written to /integrations, one row per service. Older keys may still
 * sit in the single platform_apis row, so both are read and both are cleared.
 */
const PLATFORM_COLUMNS: Record<AiProviderId, [key: string, model: string]> = {
  anthropic: ["anthropic_api_key", "anthropic_api_key_model"],
  openai: ["openai_api_key", "openai_api_key_model"],
  gemini: ["gemini_api_key", "gemini_api_key_model"],
};

const isProvider = (value: string): value is AiProviderId => (AI_PROVIDER_IDS as readonly string[]).includes(value);
const hintOf = (key: unknown) => (typeof key === "string" && key.length > 8 ? `••••${key.slice(-4)}` : "");
const blank = (): AiKeyState => ({ connected: false, recordId: null, model: "", hint: "", inPlatformRow: false });
const is404 = (err: unknown) => isAxiosError(err) && err.response?.status === 404;

export async function fetchAiKeys(): Promise<AiKeys> {
  const keys = { anthropic: blank(), openai: blank(), gemini: blank() };
  const [integrations, platform] = await Promise.allSettled([api.get("/integrations"), api.get("/platform-apis")]);
  if (integrations.status === "rejected" && platform.status === "rejected") throw integrations.reason;

  if (platform.status === "fulfilled") {
    const row = readRows(platform.value.data)[0] ?? {};
    for (const provider of AI_PROVIDER_IDS) {
      const [keyColumn, modelColumn] = PLATFORM_COLUMNS[provider];
      if (!row[keyColumn]) continue;
      keys[provider] = { ...keys[provider], connected: true, model: toText(row[modelColumn]), hint: hintOf(row[keyColumn]), inPlatformRow: true };
    }
  }

  if (integrations.status === "fulfilled") {
    assertEnvelope(integrations.value.data, "Could not read your AI keys");
    for (const row of readRows(integrations.value.data)) {
      const service = toText(row.service).toLowerCase();
      if (!isProvider(service) || row.status === 0 || row.status === "0") continue;
      const current = keys[service];
      keys[service] = {
        ...current,
        connected: true,
        recordId: row.id === undefined || row.id === null ? null : String(row.id),
        model: toText(row.model) || current.model,
        hint: hintOf(row.api_key) || toText(row.key_hint) || current.hint,
      };
    }
  }
  return keys;
}

type SaveInput = { provider: AiProviderId; apiKey: string; model?: string; recordId: string | null };

/** POST creates a new row every time, so an existing key is replaced with PUT by record id. */
export async function saveAiKey({ provider, apiKey, model, recordId }: SaveInput) {
  const body = { service: provider, api_key: apiKey.trim(), status: "1", ...(model ? { model } : {}) };
  const fallback = "Could not save your key";
  try {
    const { data } = recordId ? await api.put(`/integrations/${recordId}`, body) : await api.post("/integrations", body);
    assertEnvelope(data, fallback);
  } catch (err) {
    // The row vanished since the page loaded: create it rather than report a 404.
    if (!recordId || !is404(err)) throw err;
    const { data } = await api.post("/integrations", body);
    assertEnvelope(data, fallback);
  }
}

/** Delete the /integrations row (by id) and blank the legacy columns, so no copy of the key survives. */
export async function removeAiKey(provider: AiProviderId, state: AiKeyState) {
  if (state.recordId) {
    try {
      const { data } = await api.delete(`/integrations/${state.recordId}`);
      assertEnvelope(data, "Could not remove your key");
    } catch (err) {
      if (!is404(err)) throw err;
    }
  }
  if (state.inPlatformRow || !state.recordId) {
    const [keyColumn, modelColumn] = PLATFORM_COLUMNS[provider];
    await savePlatformKeys({ [keyColumn]: "", [modelColumn]: "" }, "Could not remove your key");
  }
}
