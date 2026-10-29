"use client";

import { BadgeDollarSign, CircleDollarSign, ReceiptText, Undo2 } from "lucide-react";
import { WorkspaceConnectorFlows } from "@/components/plugins/ConnectorFlows";
import { PAYMENT_CONNECTORS } from "@/data/connectors/payments";
import { AskAgent, type AgentPrompt } from "./AskAgent";
import { ConnectorShelf } from "./ConnectorShelf";
import { PaymentEvents } from "./PaymentEvents";
import { RecordsSection } from "./RecordsSection";

const PROMPTS: AgentPrompt[] = [
  { label: "What came in this week?", hint: "Sales across your payment accounts", Icon: CircleDollarSign, task: "List this week's sales across my connected payment accounts, newest first, with the customer and amount." },
  { label: "Refunds and disputes", hint: "Anything taken back or contested", Icon: Undo2, task: "List recent refunds and disputes across my connected payment accounts, and tell me which need a reply." },
  { label: "Revenue this month", hint: "Totals, compared with last month", Icon: BadgeDollarSign, task: "Total this month's revenue across my connected payment accounts and compare it with last month." },
  { label: "Did they pay?", hint: "Check one customer's payment", Icon: ReceiptText, task: "Check whether a customer has paid me. Ask me for their name or email, then look across my payment accounts." },
];

/** The sales and refunds feed (`/payments/events`), an agent to ask about it, and the payment accounts behind it. */
export function PaymentsView() {
  return (
    <WorkspaceConnectorFlows>
      <div className="grid gap-10">
        <PaymentEvents />

        <RecordsSection title="Ask about payments" description="An agent reads your payment accounts and answers.">
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
