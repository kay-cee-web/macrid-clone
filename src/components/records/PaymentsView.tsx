"use client";

import { BadgeDollarSign, CircleDollarSign, ReceiptText, Undo2 } from "lucide-react";
import { WorkspaceConnectorFlows } from "@/components/plugins/ConnectorFlows";
import { PAYMENT_CONNECTORS } from "@/data/connectors/payments";
import { AskAgent, type AgentPrompt } from "./AskAgent";
import { ConnectorShelf } from "./ConnectorShelf";
import { RecordsSection } from "./RecordsSection";

const PROMPTS: AgentPrompt[] = [
  { label: "What came in this week?", hint: "Sales across your payment accounts", Icon: CircleDollarSign, task: "List this week's sales across my connected payment accounts, newest first, with the customer and amount." },
  { label: "Refunds and disputes", hint: "Anything taken back or contested", Icon: Undo2, task: "List recent refunds and disputes across my connected payment accounts, and tell me which need a reply." },
  { label: "Revenue this month", hint: "Totals, compared with last month", Icon: BadgeDollarSign, task: "Total this month's revenue across my connected payment accounts and compare it with last month." },
  { label: "Did they pay?", hint: "Check one customer's payment", Icon: ReceiptText, task: "Check whether a customer has paid me. Ask me for their name or email, then look across my payment accounts." },
];

/**
 * The user's own payment accounts (read-only), and their sales and refunds,
 * which an agent reads through those accounts.
 */
export function PaymentsView() {
  return (
    <WorkspaceConnectorFlows>
      <div className="grid gap-10">
        <RecordsSection
          title="Sales and refunds"
          description="An agent reads them straight from your connected payment accounts."
        >
          <AskAgent label="Ask about payments" prompts={PROMPTS} />
        </RecordsSection>

        <RecordsSection
          title="Payment systems"
          description="Read-only: agents can see payments, never move money. Alerts send a WhatsApp message when one arrives."
        >
          <ConnectorShelf connectors={PAYMENT_CONNECTORS} />
        </RecordsSection>
      </div>
    </WorkspaceConnectorFlows>
  );
}
