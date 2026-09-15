"use client";

import type { ReactNode } from "react";
import { MessageSquareText } from "lucide-react";
import type { Column } from "@/components/ui/DataTable";
import { useAsync } from "@/hooks/useAsync";
import { formatDateTime } from "@/lib/format";
import { fetchSmsCampaigns } from "@/services/campaigns";
import type { SmsCampaign } from "@/types/records";
import { StackCell, StatusCell, TextCell } from "./cells";
import { RecordsView } from "./RecordsView";

const columns: Column<SmsCampaign>[] = [
  {
    key: "message",
    header: "Message",
    cell: (c) => <StackCell primary={<span className="font-medium">{c.name || c.message || "SMS"}</span>} secondary={c.name && c.message} />,
  },
  { key: "status", header: "Status", cell: (c) => <StatusCell status={c.status} /> },
  { key: "recipients", header: "Recipients", numeric: true, cell: (c) => <TextCell value={c.recipients} /> },
  { key: "type", header: "Type", wide: true, cell: (c) => <TextCell value={c.type} muted /> },
  { key: "send", header: "Send time", cell: (c) => <TextCell value={formatDateTime(c.sendAt)} muted /> },
];

const matches = (c: SmsCampaign, q: string) =>
  [c.name, c.message, c.status, c.type].some((field) => field.toLowerCase().includes(q));

export function SmsCampaignsView({ switcher }: { switcher: ReactNode }) {
  const rows = useAsync(fetchSmsCampaigns, [], "Could not load SMS campaigns");

  return (
    <RecordsView
      noun="SMS campaigns"
      rows={rows}
      columns={columns}
      rowKey={(c) => c.id}
      matches={matches}
      searchPlaceholder="Search by name, message or status"
      toolbar={switcher}
      empty={{
        icon: <MessageSquareText />,
        title: "No SMS campaigns yet",
        description: "Ask an agent to text a list. It needs a Twilio sender set up in Macrid.",
      }}
    />
  );
}
