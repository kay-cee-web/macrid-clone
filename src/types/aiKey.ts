/**
 * The first three run agents; the rest are image and video providers whose key
 * is only stored in the workspace, because no agent tool generates media yet.
 */
export const AI_PROVIDER_IDS = ["anthropic", "openai", "gemini", "blackforest", "runway", "luma"] as const;
export type AiProviderId = (typeof AI_PROVIDER_IDS)[number];

/** One provider's own API key, as far as the two stores report it. */
export type AiKeyState = {
  connected: boolean;
  /** The /integrations row id. PUT and DELETE bind by id, never by service name. */
  recordId: string | null;
  /** The provider's default model saved with the key ("" when none). */
  model: string;
  /** "••••ab12", never the key itself. */
  hint: string;
  /** The key also sits in the legacy platform_apis row, which removal has to blank too. */
  inPlatformRow: boolean;
};

export type AiKeys = Record<AiProviderId, AiKeyState>;
