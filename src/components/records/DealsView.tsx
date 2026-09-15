"use client";

import { Handshake } from "lucide-react";
import type { Column } from "@/components/ui/DataTable";
import { Pill } from "@/components/ui/Pill";
import { useAsync } from "@/hooks/useAsync";
import { formatAmount, formatDate } from "@/lib/format";
import { statusTone } from "@/lib/records/status";
import { fetchDeals } from "@/services/deals";
import type { Deal } from "@/types/records";
import { Blank, CreatedCell, TextCell } from "./cells";
import { DealStages } from "./DealStages";
import { RecordsView } from "./RecordsView";

const columns: Column<Deal>[] = [
  { key: "name", header: "Deal", cell: (deal) => <span className="font-medium">{deal.name}</span> },
  {
    key: "stage",
    header: "Stage",
    cell: (deal) => (deal.stage ? <Pill tone={statusTone(deal.stage)}>{deal.stage}</Pill> : <Blank />),
  },
  { key: "amount", header: "Amount", numeric: true, cell: (deal) => <TextCell value={formatAmount(deal.amount)} /> },
  { key: "company", header: "Company", wide: true, cell: (deal) => <TextCell value={deal.company} muted /> },
  { key: "owner", header: "Owner", wide: true, cell: (deal) => <TextCell value={deal.owner} muted /> },
  { key: "close", header: "Close date", wide: true, cell: (deal) => <TextCell value={formatDate(deal.closeDate)} muted /> },
  { key: "created", header: "Created", cell: (deal) => <CreatedCell value={deal.createdAt} /> },
];

const matches = (deal: Deal, q: string) =>
  [deal.name, deal.company, deal.owner, deal.stage].some((field) => field.toLowerCase().includes(q));

export function DealsView() {
  const rows = useAsync(fetchDeals, [], "Could not load your deals");

  return (
    <div className="grid gap-5">
      <DealStages deals={rows.data} />
      <RecordsView
        noun="deals"
        rows={rows}
        columns={columns}
        rowKey={(deal) => deal.id}
        matches={matches}
        searchPlaceholder="Search by deal, company, owner or stage"
        empty={{
          icon: <Handshake />,
          title: "No deals yet",
          description: "Ask an agent to open a deal for a lead, or to move one along the pipeline.",
        }}
      />
    </div>
  );
}
