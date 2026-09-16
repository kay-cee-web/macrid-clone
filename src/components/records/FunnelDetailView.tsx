"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, MousePointerClick } from "lucide-react";
import type { Column } from "@/components/ui/DataTable";
import { Pill } from "@/components/ui/Pill";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatGrid, type Stat } from "@/components/ui/StatGrid";
import { useAsync } from "@/hooks/useAsync";
import { fetchFunnelEvents, fetchFunnelStats, fetchFunnels } from "@/services/funnels";
import type { FunnelEvent, FunnelStats } from "@/types/funnels";
import { CreatedCell, TextCell } from "./cells";
import { RecordsView } from "./RecordsView";

const count = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

function statsOf(s: FunnelStats): Stat[] {
  const ctr = s.views ? `${((s.clicks / s.views) * 100).toFixed(1)}%` : "";
  return [
    { label: "Views", value: count.format(s.views), change: s.viewsChange },
    { label: "Unique visitors", value: count.format(s.uniqueVisitors), change: s.visitorsChange },
    { label: "Clicks", value: count.format(s.clicks), change: s.clicksChange },
    { label: "Click-through rate", value: ctr, note: "Clicks per view" },
  ];
}

const columns: Column<FunnelEvent>[] = [
  { key: "action", header: "Event", cell: (e) => <Pill tone={e.action === "click" ? "accent" : "neutral"}>{e.action || "event"}</Pill> },
  { key: "location", header: "Location", cell: (e) => <TextCell value={e.location} /> },
  { key: "device", header: "Device", wide: true, cell: (e) => <TextCell value={e.device} muted /> },
  { key: "referrer", header: "Came from", wide: true, cell: (e) => <TextCell value={e.referrer} muted /> },
  { key: "at", header: "When", cell: (e) => <CreatedCell value={e.at} /> },
];

/** One funnel: its totals and the latest visits and clicks. `slug` may be an id for funnels without one. */
export function FunnelDetailView({ slug }: { slug: string }) {
  const funnel = useAsync(() => fetchFunnels().then((all) => all.find((f) => f.slug === slug || f.id === slug) ?? null), [slug]);
  const stats = useAsync(() => fetchFunnelStats(slug), [slug], "Could not load this funnel's numbers");
  const events = useAsync(() => fetchFunnelEvents(slug), [slug], "Could not load this funnel's activity");
  const f = funnel.data;

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Link href="/records/funnels" className="inline-flex w-fit items-center gap-1.5 text-[13px] text-muted hover:text-ink">
          <ArrowLeft className="size-3.5" /> All funnels
        </Link>
        {funnel.status === "loading" ? (
          <Skeleton className="h-7 w-56" />
        ) : (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="text-[22px] font-semibold">{f?.name ?? slug}</h2>
            {f && <Pill tone={f.published ? "good" : "neutral"} dot={f.published}>{f.published ? "Published" : "Draft"}</Pill>}
            {f?.url && (
              <a href={f.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[13px] text-accent hover:underline">
                Open page <ExternalLink className="size-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {stats.status === "error" ? (
        <p className="text-[13px] text-bad">{stats.error}</p>
      ) : (
        <StatGrid stats={stats.data ? statsOf(stats.data) : null} />
      )}

      <div className="grid gap-2">
        <h3 className="text-[16px] font-semibold">Latest activity</h3>
        <RecordsView
          noun="events"
          rows={{ ...events, data: events.data?.events ?? null }}
          columns={columns}
          rowKey={(e) => e.id}
          matches={(e, q) => [e.action, e.location, e.device, e.referrer].some((v) => v.toLowerCase().includes(q))}
          searchPlaceholder="Search by location, device or source"
          empty={{ icon: <MousePointerClick />, title: "No visits yet", description: "Views and clicks show up here once people open the page." }}
        />
        {events.data && events.data.total > events.data.events.length && (
          <p className="text-[12.5px] text-muted">Showing the latest {events.data.events.length} of {events.data.total} events.</p>
        )}
      </div>
    </div>
  );
}
