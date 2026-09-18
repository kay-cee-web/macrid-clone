"use client";

import { useState } from "react";
import { CircleAlert, SearchX } from "lucide-react";
import { WorkbenchTabs } from "@/components/workbench/WorkbenchTabs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { TileGrid } from "@/components/ui/TileGrid";
import { ALL_MODELS, type ModelOption } from "@/data/models";
import { useAsync } from "@/hooks/useAsync";
import { fetchAiKeys } from "@/services/aiKeys";
import { IntegrateModal } from "./IntegrateModal";
import { ModelCard } from "./ModelCard";
import { ModelFilters, type KindFilter, type ProviderFilter } from "./ModelFilters";
import { ProviderStrip } from "./ProviderStrip";

/** Retired models sink below the ones worth picking today. */
const CATALOGUE = [...ALL_MODELS].sort((a, b) => Number(a.tag === "legacy") - Number(b.tag === "legacy"));

export function ModelsCatalog() {
  const keys = useAsync(fetchAiKeys, [], "Could not load your AI keys");
  const [provider, setProvider] = useState<ProviderFilter>("all");
  const [kind, setKind] = useState<KindFilter>("all");
  const [query, setQuery] = useState("");
  const [integrating, setIntegrating] = useState<ModelOption | null>(null);

  const q = query.trim().toLowerCase();
  const visible = CATALOGUE.filter(
    (m) =>
      (provider === "all" || m.provider === provider) &&
      (kind === "all" || m.kind === kind) &&
      (!q || `${m.name} ${m.id} ${m.note}`.toLowerCase().includes(q)),
  );

  const clear = () => {
    setQuery("");
    setProvider("all");
    setKind("all");
  };

  return (
    <div className="mx-auto grid w-full max-w-400 gap-8 px-4 pb-20 pt-10 sm:px-8 xl:px-14">
      <WorkbenchTabs />

      <header className="flex flex-wrap items-start justify-between gap-6">
        <div className="grid gap-2">
          <h1 className="font-sans text-2xl font-normal tracking-normal text-ink">Models</h1>
          <p className="max-w-[62ch] text-sm text-muted">
            The models your agents think with, plus the image and video models your workspace can hold a key for.
            Integrate your own key and agents on that provider run on it instead of your plan&apos;s tokens.
          </p>
        </div>
        <ProviderStrip keys={keys.data} active={provider} onPick={setProvider} />
      </header>

      <ModelFilters
        provider={provider}
        kind={kind}
        query={query}
        onProvider={setProvider}
        onKind={setKind}
        onQuery={setQuery}
      />

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
          description={q ? `Nothing matches “${query.trim()}”.` : "Nothing matches these filters."}
          action={<Button variant="secondary" onClick={clear}>Clear filters</Button>}
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
