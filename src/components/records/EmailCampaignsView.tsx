"use client";

import type { ReactNode } from "react";
import { Mail } from "lucide-react";
import type { Column } from "@/components/ui/DataTable";
import { useAsync } from "@/hooks/useAsync";
import { formatPercent } from "@/lib/format";
import { fetchEmailCampaigns } from "@/services/campaigns";
import type { EmailCampaign } from "@/types/records";
import { CreatedCell, StackCell, TextCell } from "./cells";
import { FailureReason } from "./FailureReason";
import { RecordsView } from "./RecordsView";

const columns: Column<EmailCampaign>[] = [
  {
    key: "subject",
    header: "Subject",
    cell: (c) => <StackCell primary={<span className="font-medium">{c.subject}</span>} />,
  },
  {
    key: "status",
    header: "Status",
    cell: (c) => <FailureReason status={c.status} reason={c.reason} title={c.subject} />,
  },
  { key: "recipients", header: "Recipients", numeric: true, cell: (c) => <TextCell value={c.recipients} /> },
  { key: "open", header: "Opened", numeric: true, wide: true, cell: (c) => <TextCell value={formatPercent(c.openRate)} /> },
  { key: "click", header: "Clicked", numeric: true, wide: true, cell: (c) => <TextCell value={formatPercent(c.clickRate)} /> },
  { key: "created", header: "Created", cell: (c) => <CreatedCell value={c.createdAt} /> },
];

export function EmailCampaignsView({ switcher }: { switcher: ReactNode }) {
  const rows = useAsync(fetchEmailCampaigns, [], "Could not load email campaigns");

  return (
    <RecordsView
      noun="email campaigns"
      rows={rows}
      columns={columns}
      rowKey={(c) => c.id}
      matches={(c, q) => c.subject.toLowerCase().includes(q) || c.status.toLowerCase().includes(q)}
      searchPlaceholder="Search by subject or status"
      toolbar={switcher}
      empty={{
        icon: <Mail />,
        title: "No email campaigns yet",
        description: "Ask an agent to verify a list and send it an email.",
      }}
    />
  );
}
