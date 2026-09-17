"use client";

import Link from "next/link";
import { ArrowLeft, MessageSquareText } from "lucide-react";
import type { Column } from "@/components/ui/DataTable";
import { StatGrid, type Stat } from "@/components/ui/StatGrid";
import { useAsync } from "@/hooks/useAsync";
import { formatAmount, formatDateTime } from "@/lib/format";
import { statusLabel } from "@/lib/records/status";
import { fetchSmsCampaigns, fetchSmsLogs } from "@/services/campaigns";
import type { SmsLog } from "@/types/records";
import { StackCell, StatusCell, TextCell } from "./cells";
import { RecordsView } from "./RecordsView";

const columns: Column<SmsLog>[] = [
  { key: "to", header: "To", cell: (log) => <StackCell primary={<span className="font-mono text-sm">{log.to || "—"}</span>} secondary={log.error} /> },
  { key: "status", header: "Status", cell: (log) => <StatusCell status={log.status} /> },
  { key: "cost", header: "Cost", numeric: true, wide: true, cell: (log) => <TextCell value={formatAmount(log.cost)} muted /> },
  { key: "at", header: "Time", cell: (log) => <TextCell value={formatDateTime(log.at)} muted /> },
];

function summary(logs: SmsLog[]): Stat[] {
  const count = (status: string) => logs.filter((log) => statusLabel(log.status).toLowerCase() === status).length;
  const delivered = count("delivered");
  const rate = logs.length ? `${Math.round((delivered / logs.length) * 100)}%` : "";
  return [
    { label: "Messages", value: String(logs.length) },
    { label: "Delivered", value: String(delivered), note: rate && `${rate} of messages` },
    { label: "In progress", value: String(count("pending") + count("sent") + count("queued")) },
    { label: "Failed", value: String(count("failed") + count("undelivered")) },
  ];
}

/** Every text in one SMS campaign: who it went to, whether it arrived, and why not. */
export function SmsLogsView({ campaignId }: { campaignId: string }) {
  const logs = useAsync(() => fetchSmsLogs(campaignId), [campaignId], "Could not load this campaign's messages");
  const campaign = useAsync(() => fetchSmsCampaigns().then((all) => all.find((c) => c.id === campaignId) ?? null), [campaignId]);
  const title = campaign.data?.name || campaign.data?.message || `SMS campaign ${campaignId}`;

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Link href="/records/campaigns?channel=sms" className="inline-flex w-fit items-center gap-1.5 text-sm text-muted hover:text-ink">
          <ArrowLeft className="size-3.5" /> SMS campaigns
        </Link>
        <h2 className="line-clamp-2 text-2xl font-semibold">{title}</h2>
      </div>
      <StatGrid stats={logs.data ? summary(logs.data) : null} />
      <RecordsView
        noun="messages"
        rows={logs}
        columns={columns}
        rowKey={(log) => log.id}
        matches={(log, q) => [log.to, log.status, log.error].some((v) => v.toLowerCase().includes(q))}
        searchPlaceholder="Search by number, status or error"
        empty={{ icon: <MessageSquareText />, title: "No messages logged", description: "Delivery results appear once the campaign sends." }}
      />
    </div>
  );
}
