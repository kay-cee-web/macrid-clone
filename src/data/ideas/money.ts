import type { Idea } from "@/types/idea";

/**
 * Money through the inbox and the user's own payment accounts (Stripe, PayPal,
 * Paystack…), read-only. The agent can see what was paid, but nothing stores
 * invoices, so chasing one only gets halfway, and no bank is connected.
 */
export const MONEY: Idea[] = [
  {
    title: "New payment alert",
    ready: true,
    platforms: ["payments"],
    description: "Every hour, check my payment accounts and tell me about any payment over $1,000: who paid and what for.",
  },
  {
    title: "Revenue this month",
    ready: true,
    platforms: ["payments"],
    description: "Every Monday, total what came in this month in each currency, after fees, and say where the month lands at this pace.",
  },
  {
    title: "Did they pay?",
    ready: true,
    platforms: ["payments"],
    description: "When I name a client or an amount, check my payment accounts and tell me whether and when it was paid.",
  },
  {
    title: "Refunds and disputes",
    ready: true,
    platforms: ["payments"],
    description: "Every Monday, list last week's refunds and disputes, what each one cost and who they were for.",
  },
  {
    title: "Weekly expense report",
    platforms: ["inbox", "email"],
    description: "Every Friday, pull the receipts out of my inbox, total them and email the summary to finance.",
  },
  {
    title: "Subscription watch",
    platforms: ["inbox"],
    description: "Every month, scan my inbox for recurring charges and flag the subscriptions I'm not using.",
  },
  {
    title: "Invoice reminder",
    platforms: ["payments", "email"],
    description: "When an invoice has gone unpaid for seven days, check it really hasn't been paid, then draft a polite reminder.",
  },
  {
    title: "Budget check",
    platforms: ["email"],
    description: "Every Friday, compare this week's spending to the monthly budget and email me where it stands.",
  },
  {
    title: "Low balance warning",
    blocked: "a bank connection",
    platforms: ["bank"],
    description: "When a tracked account drops below the floor I set, warn me the same day.",
  },
  {
    title: "Quote to invoice",
    platforms: ["email"],
    description: "When a deal is won, draft the invoice from what we agreed and send it to the right contact.",
  },
  {
    title: "Chase the late payers",
    platforms: ["payments", "email"],
    description: "Every Friday, list the invoices past their date that still haven't been paid, and draft the next chase for each.",
  },
  {
    title: "Spend per campaign",
    platforms: [],
    description: "Put what each campaign cost beside what it brought in, so I can see which ones actually pay.",
  },
  {
    title: "Tax return prep",
    platforms: ["email"],
    description: "Pull the income, expenses and deductions out of my documents into one report, and tell me what's missing before I file.",
  },
];
