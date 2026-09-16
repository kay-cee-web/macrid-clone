"use client";

import { useState } from "react";
import { Mail, MessageCircle, MessageSquareText } from "lucide-react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useAsync } from "@/hooks/useAsync";
import {
  RANGES, emailSummary, formatCount, formatRate, inRange, smsSummary, whatsappSummary, type Range,
} from "@/lib/records/analytics";
import { formatPercent } from "@/lib/format";
import { fetchAllSmsLogs, fetchEmailCampaigns, fetchSmsCampaigns, fetchWhatsAppCampaigns } from "@/services/campaigns";
import type { EmailCampaign } from "@/types/records";
import { AnalyticsSection } from "./AnalyticsSection";
import { CreatedCell, TextCell } from "./cells";

const topColumns: Column<EmailCampaign>[] = [
  { key: "subject", header: "Top campaigns by opens", cell: (c) => <span className="font-medium">{c.subject}</span> },
  { key: "recipients", header: "Recipients", numeric: true, wide: true, cell: (c) => <TextCell value={c.recipients} /> },
  { key: "open", header: "Opened", numeric: true, cell: (c) => <TextCell value={formatPercent(c.openRate)} /> },
  { key: "click", header: "Clicked", numeric: true, cell: (c) => <TextCell value={formatPercent(c.clickRate)} /> },
  { key: "created", header: "Created", wide: true, cell: (c) => <CreatedCell value={c.createdAt} /> },
];

/** Outreach performance across email, SMS and WhatsApp, computed from campaign rows. */
export function AnalyticsView() {
  const [range, setRange] = useState<Range>("30");
  const email = useAsync(fetchEmailCampaigns, [], "Could not load email campaigns");
  const sms = useAsync(() => Promise.all([fetchSmsCampaigns(), fetchAllSmsLogs()]), [], "Could not load SMS campaigns");
  const whatsapp = useAsync(fetchWhatsAppCampaigns, [], "Could not load WhatsApp broadcasts");

  const e = email.data ? emailSummary(inRange(email.data, range)) : null;
  const s = sms.data ? smsSummary(inRange(sms.data[0], range), sms.data[1]) : null;
  const w = whatsapp.data ? whatsappSummary(inRange(whatsapp.data, range)) : null;

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[60ch] text-[14px] text-muted">
          How your campaigns performed, whether an agent or a person sent them. Ask an agent to dig into any of these.
        </p>
        <SegmentedControl label="Time range" value={range} onChange={setRange} options={RANGES.map((r) => ({ ...r }))} />
      </div>

      <AnalyticsSection
        title="Email"
        icon={<Mail />}
        error={email.error}
        onRetry={email.reload}
        stats={e && [
          { label: "Campaigns sent", value: formatCount(e.sent), note: `${e.campaigns} created · ${e.failed} failed` },
          { label: "Recipients", value: formatCount(e.recipients) },
          { label: "Average open rate", value: formatRate(e.openRate), note: "Across sent campaigns" },
          { label: "Average click rate", value: formatRate(e.clickRate), note: "Across sent campaigns" },
        ]}
      >
        {e && e.top.length > 0 && <DataTable label="Top email campaigns" columns={topColumns} rows={e.top} rowKey={(c) => c.id} />}
      </AnalyticsSection>

      <AnalyticsSection
        title="SMS"
        icon={<MessageSquareText />}
        error={sms.error}
        onRetry={sms.reload}
        stats={s && [
          { label: "Campaigns", value: formatCount(s.campaigns) },
          { label: "Messages", value: formatCount(s.messages) },
          { label: "Delivery rate", value: formatRate(s.deliveryRate), note: `${formatCount(s.delivered)} delivered` },
          { label: "Failed", value: formatCount(s.failed) },
        ]}
      />

      <AnalyticsSection
        title="WhatsApp"
        icon={<MessageCircle />}
        error={whatsapp.error}
        onRetry={whatsapp.reload}
        stats={w && [
          { label: "Broadcasts", value: formatCount(w.campaigns) },
          { label: "Messages sent", value: formatCount(w.sent) },
          { label: "Read rate", value: formatRate(w.readRate) },
          { label: "Reply rate", value: formatRate(w.replyRate), note: `${formatCount(w.failed)} failed` },
        ]}
      />
    </div>
  );
}
