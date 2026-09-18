"use client";

import { Check, Copy, Ellipsis } from "lucide-react";
import { toast } from "sonner";
import { IconButton } from "@/components/ui/IconButton";
import { Menu } from "@/components/ui/Menu";
import { AI_PROVIDER_BY_ID } from "@/data/aiProviders";
import { KIND_LABELS, TAG_LABELS, type ModelOption } from "@/data/models";
import type { AiKeyState } from "@/types/aiKey";
import { ProviderLogo } from "./ProviderLogo";

type ModelCardProps = {
  model: ModelOption;
  /** The provider's key, or null while it loads or couldn't be read. */
  keyState: AiKeyState | null;
  onIntegrate: (model: ModelOption) => void;
};

async function copyId(id: string) {
  try {
    await navigator.clipboard.writeText(id);
    toast.success("Model ID copied.");
  } catch {
    toast.error("Couldn't copy. Your browser blocked clipboard access.");
  }
}

export function ModelCard({ model, keyState, onIntegrate }: ModelCardProps) {
  const provider = AI_PROVIDER_BY_ID[model.provider];
  const connected = Boolean(keyState?.connected);
  const isDefault = connected && keyState?.model === model.id;
  const description =
    model.tag === "legacy"
      ? `${model.note}. Retired, but kept so anything already on it keeps working.`
      : model.kind === "text"
        ? `${model.note}. ${provider.name} model with a ${model.spec}-token context window.`
        : `${model.note}. ${provider.name} ${model.kind} model, up to ${model.spec}. Agents still think with a text model.`;

  return (
    <article className="group relative grid content-start gap-5 rounded-3xl border border-line bg-raised/40 p-6 backdrop-blur transition-[background-color,box-shadow] duration-200 hover:bg-raised/80 hover:shadow-float">
      <div className="flex flex-wrap items-start gap-x-4 gap-y-3 sm:flex-nowrap">
        <ProviderLogo provider={model.provider} />
        <div className="grid min-w-0 flex-1 basis-40 gap-1.5">
          <h3 className="truncate text-xl text-ink">{model.name}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-md bg-raised px-2 py-0.5 text-muted">{TAG_LABELS[model.tag]}</span>
            {model.kind !== "text" && <span className="rounded-md bg-raised px-2 py-0.5 text-muted">{KIND_LABELS[model.kind]}</span>}
            <span className="font-mono text-faint">{model.spec}</span>
            {connected && (
              <span className="inline-flex items-center gap-1 text-good">
                <Check className="size-3.5" />
                {isDefault ? "Your default" : "Your key"}
              </span>
            )}
          </div>
        </div>

        {/* Revealed on hover or focus on devices that can hover; always shown on touch screens.
            On phones it drops to its own row so the name keeps its width. */}
        <div className="flex w-full shrink-0 items-center justify-end gap-1 transition-opacity sm:w-auto can-hover:opacity-0 can-hover:group-hover:opacity-100 can-hover:focus-within:opacity-100">
          <Menu
            align="end"
            items={[{ label: "Copy model ID", icon: <Copy />, onSelect: () => void copyId(model.id) }]}
            trigger={(props) => (
              <IconButton label={`More for ${model.name}`} {...props}>
                <Ellipsis />
              </IconButton>
            )}
          />
          <button
            type="button"
            onClick={() => onIntegrate(model)}
            className="h-9 rounded-lg bg-ink px-4 text-sm font-medium text-ground transition-opacity hover:opacity-90"
          >
            {connected ? "Manage" : "Integrate"}
          </button>
        </div>
      </div>

      <p className="line-clamp-2 min-h-13 text-base leading-relaxed text-muted">{description}</p>
    </article>
  );
}
