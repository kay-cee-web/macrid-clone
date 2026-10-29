"use client";

import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { formatMoney } from "@/lib/records/dateRange";
import type { AdAccountOverview, AdCampaign } from "@/types/ads";
import { StatusCell, TextCell } from "./cells";

/** One account's campaigns for the period, with the same figures as the account row. */
export function AdCampaignsModal({ account, onClose }: { account: AdAccountOverview; onClose: () => void }) {
  const columns: Column<AdCampaign>[] = [
    { key: "name", header: "Campaign", cell: (c) => <span className="font-medium">{c.name}</span> },
    { key: "status", header: "Status", cell: (c) => <StatusCell status={c.status} /> },
    { key: "spend", header: "Spend", numeric: true, cell: (c) => <TextCell value={formatMoney(c.totals.spend, account.currency)} /> },
    { key: "clicks", header: "Clicks", numeric: true, cell: (c) => <TextCell value={c.totals.clicks?.toLocaleString()} /> },
    { key: "ctr", header: "CTR", numeric: true, cell: (c) => <TextCell value={c.totals.ctr} muted /> },
  ];

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      title={account.name || "Ad account"}
      description={account.period ? `Campaigns, ${account.period}` : "Campaigns"}
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <DataTable label="Campaigns" columns={columns} rows={account.campaigns} rowKey={(c) => c.id || c.name} />
    </Modal>
  );
}
