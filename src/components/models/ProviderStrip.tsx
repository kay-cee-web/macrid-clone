import { AI_PROVIDERS } from "@/data/aiProviders";
import { cn } from "@/lib/cn";
import type { AiKeys, AiProviderId } from "@/types/aiKey";
import { ProviderLogo } from "./ProviderLogo";

type ProviderStripProps = {
  keys: AiKeys | null;
  active: AiProviderId | "all";
  onPick: (provider: AiProviderId | "all") => void;
};

/** Provider logos that filter the catalogue; a dot marks the ones running on the user's key. */
export function ProviderStrip({ keys, active, onPick }: ProviderStripProps) {
  return (
    <div className="flex items-center gap-2">
      {AI_PROVIDERS.map((provider) => {
        const selected = active === provider.id;
        const connected = Boolean(keys?.[provider.id].connected);
        return (
          <button
            key={provider.id}
            type="button"
            aria-pressed={selected}
            title={`${provider.name}${connected ? " · your key is connected" : ""}`}
            onClick={() => onPick(selected ? "all" : provider.id)}
            className={cn("relative rounded-xl transition-transform hover:-translate-y-0.5", selected && "ring-2 ring-accent ring-offset-2 ring-offset-ground")}
          >
            <ProviderLogo provider={provider.id} className="size-10 rounded-lg" />
            <span className="sr-only">
              Show {provider.name} models{connected ? " (your key is connected)" : ""}
            </span>
            {connected && <span aria-hidden className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-good ring-2 ring-ground" />}
          </button>
        );
      })}
    </div>
  );
}
