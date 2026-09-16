"use client";

import { ExternalLink, PanelsTopLeft } from "lucide-react";
import type { Column } from "@/components/ui/DataTable";
import { Pill } from "@/components/ui/Pill";
import { useAsync } from "@/hooks/useAsync";
import { fetchFunnels } from "@/services/funnels";
import type { Funnel } from "@/types/funnels";
import { Blank, CreatedCell, StackCell } from "./cells";
import { RecordsView } from "./RecordsView";

const hostOf = (url: string) => url.replace(/^https?:\/\//i, "").replace(/\/$/, "");

const columns: Column<Funnel>[] = [
  {
    key: "name",
    header: "Funnel",
    cell: (f) => <StackCell primary={<span className="font-medium">{f.name}</span>} secondary={<span className="capitalize">{f.format}</span>} />,
  },
  {
    key: "status",
    header: "Status",
    cell: (f) => <Pill tone={f.published ? "good" : "neutral"} dot={f.published}>{f.published ? "Published" : "Draft"}</Pill>,
  },
  {
    key: "url",
    header: "Address",
    wide: true,
    cell: (f) =>
      f.url ? (
        <a
          href={f.url}
          target="_blank"
          rel="noreferrer"
          className="relative z-10 inline-flex max-w-64 items-center gap-1 text-muted hover:text-ink"
        >
          <span className="truncate">{hostOf(f.url)}</span>
          <ExternalLink className="size-3 shrink-0" />
        </a>
      ) : (
        <Blank />
      ),
  },
  { key: "created", header: "Created", cell: (f) => <CreatedCell value={f.createdAt} /> },
];

const matches = (f: Funnel, q: string) => [f.name, f.format, f.url].some((field) => field.toLowerCase().includes(q));

/** Funnels and landing pages. A row opens its visits and clicks. */
export function FunnelsView() {
  const rows = useAsync(fetchFunnels, [], "Could not load your funnels");

  return (
    <RecordsView
      noun="funnels"
      rows={rows}
      columns={columns}
      rowKey={(f) => f.id}
      rowHref={(f) => `/records/funnels/${encodeURIComponent(f.slug || f.id)}`}
      matches={matches}
      searchPlaceholder="Search by name, format or address"
      empty={{
        icon: <PanelsTopLeft />,
        title: "No funnels yet",
        description: "Ask an agent to build a landing page for an offer.",
      }}
    />
  );
}
