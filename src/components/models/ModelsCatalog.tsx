"use client";

import { useState } from "react";
import { ChevronDown, CircleAlert, Search, SearchX } from "lucide-react";
import { HubTabs } from "@/components/agents/HubTabs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Menu } from "@/components/ui/Menu";
import { TileGrid } from "@/components/ui/TileGrid";
import { buttonStyles } from "@/components/ui/button-styles";
import { AI_PROVIDERS, AI_PROVIDER_BY_ID } from "@/data/aiProviders";
import { ALL_MODELS, type ModelOption } from "@/data/models";
import { useAsync } from "@/hooks/useAsync";
import { fetchAiKeys } from "@/services/aiKeys";
import type { AiProviderId } from "@/types/aiKey";
import { IntegrateModal } from "./IntegrateModal";
import { ModelCard } from "./ModelCard";
import { ProviderStrip } from "./ProviderStrip";

type ProviderFilter = AiProviderId | "all";

/** Retired models sink below the ones worth picking today. */
const CATALOGUE = [...ALL_MODELS].sort((a, b) => Number(a.tag === "legacy") - Number(b.tag === "legacy"));

export function ModelsCatalog() {
  const keys = useAsync(fetchAiKeys, [], "Could not load your AI keys");
  const [provider, setProvider] = useState<ProviderFilter>("all");
  const [query, setQuery] = useState("");
  const [integrating, setIntegrating] = useState<ModelOption | null>(null);

  const q = query.trim().toLowerCase();
  const visible = CATALOGUE.filter(
    (m) => (provider === "all" || m.provider === provider) && (!q || `${m.name} ${m.id} ${m.note}`.toLowerCase().includes(q)),
  );
  const providerLabel = provider === "all" ? "All" : AI_PROVIDER_BY_ID[provider].name;

  return (
    <div className="mx-auto grid w-full max-w-400 gap-8 px-4 pb-20 pt-10 sm:px-8 xl:px-14">
      <HubTabs />

      <header className="flex flex-wrap items-start justify-between gap-6">
        <div className="grid gap-2">
          <h1 className="font-sans text-2xl font-normal tracking-normal text-ink">Models</h1>
          <p className="max-w-[62ch] text-sm text-muted">
            The AI models your agents can think with. Integrate your own Anthropic, OpenAI or Gemini key and agents on
            that provider run on it instead of your plan&apos;s tokens.
          </p>
        </div>
        <ProviderStrip keys={keys.data} active={provider} onPick={setProvider} />
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Menu
          align="start"
          items={[
            { label: "All", checked: provider === "all", onSelect: () => setProvider("all") },
            ...AI_PROVIDERS.map((p) => ({ label: p.name, checked: provider === p.id, onSelect: () => setProvider(p.id) })),
          ]}
          trigger={(props) => (
            <button type="button" {...props} className={buttonStyles({ variant: "secondary", className: "h-10 gap-3 rounded-lg px-4 font-normal" })}>
              <span className="text-muted">Provider:</span>
              {providerLabel}
              <ChevronDown className="size-4 text-muted" />
            </button>
          )}
        />
        <label htmlFor="model-search" className="sr-only">
          Search models
        </label>
        <Input
          id="model-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search…"
          leading={<Search />}
          className="h-10 w-full rounded-lg border-transparent bg-raised sm:w-80"
        />
      </div>

      {keys.status === "error" && (
        <p role="alert" className="flex flex-wrap items-center gap-2 rounded-xl bg-bad-soft px-4 py-3 text-sm text-bad">
          <CircleAlert className="size-4" />
          {keys.error} Integrated keys won&apos;t show until this loads.
          <Button variant="ghost" size="sm" className="ml-auto" loading={keys.refreshing} onClick={keys.reload}>
            Try again
          </Button>
        </p>
      )}

      {visible.length === 0 ? (
        <EmptyState
          icon={<SearchX />}
          title="No models match"
          description={q ? `Nothing matches “${query.trim()}”.` : "No models for this provider."}
          action={<Button variant="secondary" onClick={() => { setQuery(""); setProvider("all"); }}>Clear filters</Button>}
        />
      ) : (
        <TileGrid className="gap-7">
          {visible.map((model) => (
            <ModelCard key={model.id} model={model} keyState={keys.data?.[model.provider] ?? null} onIntegrate={setIntegrating} />
          ))}
        </TileGrid>
      )}

      {integrating && (
        <IntegrateModal
          model={integrating}
          keyState={keys.data?.[integrating.provider] ?? null}
          onClose={() => setIntegrating(null)}
          onChanged={keys.reload}
        />
      )}
    </div>
  );
}
