import { AI_PROVIDER_BY_ID } from "@/data/aiProviders";
import type { ModelOption } from "@/data/models";

/**
 * What the integrate dialog says. A text key changes how agents are billed; a
 * media key is only stored, because nothing generates images or video yet.
 */
export function integrateCopy(model: ModelOption, connected: boolean, hint: string) {
  const provider = AI_PROVIDER_BY_ID[model.provider];
  const media = model.kind !== "text";

  return {
    title: connected ? `Manage ${provider.name} key` : `Integrate ${model.name}`,
    description: connected
      ? `Your ${provider.name} key${hint ? ` (${hint})` : ""} is connected. Paste a new one to replace it.`
      : media
        ? `Add your own ${provider.name} API key. It's kept in your workspace for ${model.kind} work — agents still think with a text model.`
        : `Add your own ${provider.name} API key. Agents on ${provider.name} models then run on your key instead of your plan's tokens.`,
    removeTitle: `Remove your ${provider.name} key?`,
    removeDescription: media
      ? `Your ${provider.name} key is deleted from this workspace. Nothing else changes.`
      : `Agents on ${provider.name} models stop using your key and run on your plan's tokens again.`,
    removedToast: media
      ? `${provider.name} key removed.`
      : `${provider.name} key removed. Agents go back to Dexisphere's models.`,
  };
}
