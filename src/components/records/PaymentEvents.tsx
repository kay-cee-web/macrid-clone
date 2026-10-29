"use client";

import { useMemo, useState } from "react";
import { ReceiptText } from "lucide-react";
import type { Column } from "@/components/ui/DataTable";
import { Pill, type PillTone } from "@/components/ui/Pill";
import { Select } from "@/components/ui/Select";
import { useAsync } from "@/hooks/useAsync";
import { formatMoney } from "@/lib/records/dateRange";
import { statusLabel } from "@/lib/records/status";
import { fetchPaymentEvents } from "@/services/payments";
import type { PaymentEvent } from "@/types/payment";
import { ConnectorCell, CreatedCell, StackCell, TextCell } from "./cells";
import { RecordsSection } from "./RecordsSection";
import { RecordsView } from "./RecordsView";

/** "payment.success" → "Payment success". */
const kindLabel = (kind: string) => statusLabel(kind.replace(/\./g, " "));

/** Money back or contested reads amber or red; a failure red; anything else (a sale) green. */
const kindTone = (kind: string): PillTone =>
  /fail|dispute|chargeback/i.test(kind) ? "bad" : /refund/i.test(kind) ? "warn" : "good";

const columns: Column<PaymentEvent>[] = [
  { key: "type", header: "Type", cell: (e) => (e.kind ? <Pill tone={kindTone(e.kind)}>{kindLabel(e.kind)}</Pill> : <TextCell value="" />) },
  { key: "customer", header: "Customer", cell: (e) => <StackCell primary={e.customer || "Unknown customer"} secondary={e.description} /> },
  { key: "amount", header: "Amount", numeric: true, cell: (e) => <TextCell value={formatMoney(e.amount, e.currency)} /> },
  { key: "reference", header: "Reference", wide: true, cell: (e) => <TextCell value={e.reference && <span className="font-mono text-xs">{e.reference}</span>} muted /> },
  { key: "provider", header: "Via", wide: true, cell: (e) => <ConnectorCell connectorKey={e.provider} /> },
  { key: "when", header: "When", cell: (e) => <CreatedCell value={e.at || null} /> },
];

const matches = (e: PaymentEvent, q: string) =>
  [e.kind, e.customer, e.reference, e.description, e.provider].some((f) => f.toLowerCase().includes(q));

/** `GET /payments/events`: every payment, refund and dispute the connected accounts reported. */
export function PaymentEvents() {
  const events = useAsync(fetchPaymentEvents, [], "Could not load your payments");
  const [kind, setKind] = useState("");
  const kinds = useMemo(() => [...new Set((events.data?.rows ?? []).map((e) => e.kind).filter(Boolean))].sort(), [events.data]);
  const rows = events.data ? events.data.rows.filter((e) => !kind || e.kind === kind) : null;

  return (
    <RecordsSection title="Sales and refunds" description="Everything your connected payment accounts reported, newest first.">
      <RecordsView
        noun="payments"
        rows={{ ...events, data: rows }}
        columns={columns}
        rowKey={(e) => e.id}
        matches={matches}
        searchPlaceholder="Search by customer, reference or type"
        toolbar={
          kinds.length > 1 && (
            <>
              <label htmlFor="payment-kind" className="sr-only">Filter by type</label>
              <Select id="payment-kind" className="w-44" value={kind} onChange={(e) => setKind(e.target.value)}>
                <option value="">All types</option>
                {kinds.map((k) => <option key={k} value={k}>{kindLabel(k)}</option>)}
              </Select>
            </>
          )
        }
        empty={{
          icon: <ReceiptText />,
          title: "No payments yet",
          description: "They appear here as your payment accounts report them. Set up Alerts on a connected account below.",
        }}
      />
      {events.data && events.data.lastPage > 1 && (
        <p className="text-xs text-muted">Showing the latest {events.data.rows.length} of {events.data.total}.</p>
      )}
    </RecordsSection>
  );
}
