"use client";

import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import type { Column } from "@/components/ui/DataTable";
import { useAsync } from "@/hooks/useAsync";
import { formatDateTime } from "@/lib/format";
import { fetchWhatsAppCampaigns } from "@/services/campaigns";
import type { WhatsAppCampaign } from "@/types/records";
import { StatusCell, TextCell } from "./cells";
import { RecordsView } from "./RecordsView";

const columns: Column<WhatsAppCampaign>[] = [
  { key: "name", header: "Broadcast", cell: (c) => <span className="font-medium">{c.name}</span> },
  { key: "status", header: "Status", cell: (c) => <StatusCell status={c.status} /> },
  { key: "recipients", header: "Recipients", numeric: true, cell: (c) => <TextCell value={c.recipients} /> },
  { key: "delivered", header: "Delivered", numeric: true, wide: true, cell: (c) => <TextCell value={c.delivered ?? c.sent} /> },
  { key: "read", header: "Read", numeric: true, wide: true, cell: (c) => <TextCell value={c.read} /> },
  { key: "replied", header: "Replied", numeric: true, wide: true, cell: (c) => <TextCell value={c.replied} /> },
  { key: "failed", header: "Failed", numeric: true, cell: (c) => <TextCell value={c.failed} muted /> },
  { key: "send", header: "Sent", cell: (c) => <TextCell value={formatDateTime(c.sendAt)} muted /> },
];

export function WhatsAppCampaignsView({ switcher }: { switcher: ReactNode }) {
  const rows = useAsync(fetchWhatsAppCampaigns, [], "Could not load WhatsApp broadcasts");

  return (
    <RecordsView
      noun="WhatsApp broadcasts"
      rows={rows}
      columns={columns}
      rowKey={(c) => c.id}
      matches={(c, q) => c.name.toLowerCase().includes(q) || c.status.toLowerCase().includes(q)}
      searchPlaceholder="Search by name or status"
      toolbar={switcher}
      empty={{
        icon: <MessageCircle />,
        title: "No WhatsApp broadcasts yet",
        description: "Ask an agent to message a list on WhatsApp. It needs WhatsApp Business connected in Dexisphere.",
      }}
    />
  );
}
