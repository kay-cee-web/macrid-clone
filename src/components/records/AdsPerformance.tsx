"use client";

import { useState } from "react";
import { ChartNoAxesCombined } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Column } from "@/components/ui/DataTable";
import { Pill } from "@/components/ui/Pill";
import { Select } from "@/components/ui/Select";
import { useAsync } from "@/hooks/useAsync";
import { formatDate } from "@/lib/format";
import { RANGE_PRESETS, formatMoney, rangeFor } from "@/lib/records/dateRange";
import { fetchAdsOverview } from "@/services/ads";
import type { AdAccountOverview } from "@/types/ads";
import { AdAccountCell } from "./AdAccountCell";
import { AdAccountProblem } from "./AdAccountProblem";
import { AdCampaignsModal } from "./AdCampaignsModal";
import { TextCell } from "./cells";
import { RecordsSection } from "./RecordsSection";
import { RecordsView } from "./RecordsView";

const count = (value: number | null) => (value === null ? "" : value.toLocaleString());

const matches = (a: AdAccountOverview, q: string) => [a.name, a.platform, a.currency].some((f) => f.toLowerCase().includes(q));

/** `GET /ads/overview`: each ad account's figures for the chosen period, in its own currency. */
export function AdsPerformance() {
  const [days, setDays] = useState("30");
  const overview = useAsync(() => { const { from, to } = rangeFor(days); return fetchAdsOverview(from, to); }, [days], "Could not load your ad performance");
  const [open, setOpen] = useState<AdAccountOverview | null>(null);

  const columns: Column<AdAccountOverview>[] = [
    { key: "account", header: "Ad account", cell: (a) => <AdAccountCell platform={a.platform} name={a.name} /> },
    { key: "spend", header: "Spend", numeric: true, cell: (a) => <TextCell value={formatMoney(a.totals.spend, a.currency)} /> },
    { key: "impressions", header: "Impressions", numeric: true, wide: true, cell: (a) => <TextCell value={count(a.totals.impressions)} /> },
    { key: "clicks", header: "Clicks", numeric: true, cell: (a) => <TextCell value={count(a.totals.clicks)} /> },
    { key: "ctr", header: "CTR", numeric: true, wide: true, cell: (a) => <TextCell value={a.totals.ctr} muted /> },
    { key: "cpc", header: "CPC", numeric: true, wide: true, cell: (a) => <TextCell value={formatMoney(a.totals.cpc, a.currency)} muted /> },
    {
      key: "status",
      header: "Status",
      cell: (a) =>
        a.error ? <AdAccountProblem account={a} />
        : a.active ? <Pill tone="good" dot>Active</Pill> : <Pill dot>Inactive</Pill>,
    },
    {
      key: "campaigns",
      header: "Campaigns",
      cell: (a) =>
        a.campaigns.length ? (
          <Button size="sm" variant="ghost" className="relative z-10 h-7" onClick={() => setOpen(a)}>
            {a.campaigns.length} campaign{a.campaigns.length === 1 ? "" : "s"}
          </Button>
        ) : <TextCell value="" />,
    },
  ];

  const range = overview.data?.from ? `${formatDate(overview.data.from)} – ${formatDate(overview.data.to)}` : "";

  return (
    <RecordsSection title="Performance" description={range ? `Spend and results, ${range}. Each account in its own currency.` : "Spend and results for each ad account."}>
      <RecordsView
        noun="ad accounts"
        rows={{ ...overview, data: overview.data?.accounts ?? null }}
        columns={columns}
        rowKey={(a) => a.id}
        matches={matches}
        searchPlaceholder="Search ad accounts"
        toolbar={
          <>
            <label htmlFor="ads-range" className="sr-only">Period</label>
            <Select id="ads-range" className="w-44" value={days} onChange={(e) => setDays(e.target.value)}>
              {RANGE_PRESETS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </Select>
          </>
        }
        empty={{ icon: <ChartNoAxesCombined />, title: "No ad accounts yet", description: "They come with the sign-ins below: Meta Ads with Facebook, Google Ads with YouTube." }}
      />
      {open && <AdCampaignsModal account={open} onClose={() => setOpen(null)} />}
    </RecordsSection>
  );
}
