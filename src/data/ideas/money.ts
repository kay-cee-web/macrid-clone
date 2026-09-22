import type { Idea } from "@/types/idea";

/**
 * Money that passes through the inbox. Nothing here reads a bank or a payment
 * processor: the agent works from the receipts and invoices it can see.
 */
export const MONEY: Idea[] = [
  {
    title: "Weekly expense report",
    platforms: ["email"],
    description: "Every Friday, pull the receipts out of my inbox, total them and email the summary to finance.",
  },
  {
    title: "New payment alert",
    platforms: ["email"],
    description: "When a payment confirmation over $1,000 lands, tell me straight away with who it's from and what it's for.",
  },
  {
    title: "Subscription watch",
    platforms: ["email"],
    description: "Every month, scan my inbox for recurring charges and flag the subscriptions I'm not using.",
  },
  {
    title: "Invoice reminder",
    platforms: ["email"],
    description: "When an invoice has gone unpaid for seven days, draft a polite payment reminder to the client.",
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
    title: "Revenue this month",
    ready: true,
    platforms: [],
    description: "Every Monday, total what I've won and what's still open, and say what the month lands on if nothing changes.",
  },
  {
    title: "Quote to invoice",
    platforms: ["email"],
    description: "When a deal is won, draft the invoice from what we agreed and send it to the right contact.",
  },
  {
    title: "Chase the late payers",
    platforms: ["email"],
    description: "Every Friday, list the invoices past their date and draft the next chase for each, firmer as they age.",
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
