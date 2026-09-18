"use client";

import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Menu } from "@/components/ui/Menu";
import { buttonStyles } from "@/components/ui/button-styles";
import { AI_PROVIDERS, AI_PROVIDER_BY_ID } from "@/data/aiProviders";
import { KIND_LABELS, type ModelKind } from "@/data/models";
import type { AiProviderId } from "@/types/aiKey";

export type ProviderFilter = AiProviderId | "all";
export type KindFilter = ModelKind | "all";

type ModelFiltersProps = {
  provider: ProviderFilter;
  kind: KindFilter;
  query: string;
  onProvider: (value: ProviderFilter) => void;
  onKind: (value: KindFilter) => void;
  onQuery: (value: string) => void;
};

const KINDS: ModelKind[] = ["text", "image", "video"];

/** A labelled dropdown, styled like the toolbar buttons. */
function Picker<T extends string>({ label, value, items, onPick }: {
  label: string;
  value: string;
  items: { value: T; label: string }[];
  onPick: (value: T) => void;
}) {
  return (
    <Menu
      align="start"
      items={items.map((item) => ({ label: item.label, checked: item.value === value, onSelect: () => onPick(item.value) }))}
      trigger={(props) => (
        <button type="button" {...props} className={buttonStyles({ variant: "secondary", className: "h-10 gap-3 rounded-lg px-4 font-normal" })}>
          <span className="text-muted">{label}:</span>
          {items.find((item) => item.value === value)?.label ?? "All"}
          <ChevronDown className="size-4 text-muted" />
        </button>
      )}
    />
  );
}

export function ModelFilters({ provider, kind, query, onProvider, onKind, onQuery }: ModelFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Picker
          label="Provider"
          value={provider}
          onPick={onProvider}
          items={[
            { value: "all" as ProviderFilter, label: "All" },
            ...AI_PROVIDERS.map((p) => ({ value: p.id as ProviderFilter, label: AI_PROVIDER_BY_ID[p.id].name })),
          ]}
        />
        <Picker
          label="Type"
          value={kind}
          onPick={onKind}
          items={[
            { value: "all" as KindFilter, label: "All" },
            ...KINDS.map((k) => ({ value: k as KindFilter, label: KIND_LABELS[k] })),
          ]}
        />
      </div>
      <label htmlFor="model-search" className="sr-only">
        Search models
      </label>
      <Input
        id="model-search"
        type="search"
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder="Search…"
        leading={<Search />}
        className="h-10 w-full rounded-lg border-transparent bg-raised sm:w-80"
      />
    </div>
  );
}
