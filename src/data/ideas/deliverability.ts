import type { Idea } from "@/types/idea";

export const DELIVERABILITY: Idea[] = [
  {
    title: "Pre-send list verification",
    blocked: "an email verification provider",
    platforms: ["email", "email_verification"],
    description: "Before a campaign goes out, verify the list and hold back every invalid, risky or catch-all address.",
  },
  {
    title: "Sending domain watch",
    platforms: ["email"],
    description: "Every week, re-check SPF, DKIM and DMARC on my sending domains and tell me the moment one breaks.",
  },
  {
    title: "New sender warm-up",
    platforms: ["email"],
    description: "When I add a sender, ramp its volume gradually over its first weeks instead of sending everything at once.",
  },
  {
    title: "Spam placement alerts",
    platforms: ["email"],
    description: "Watch inbox placement per campaign and alert me as soon as one of my domains starts going to spam.",
  },
  {
    title: "Inactive address retirement",
    platforms: ["email"],
    description: "Each month, retire the contacts who haven't opened anything in six months so my reputation holds.",
  },
  {
    title: "Spam-filter copy check",
    ready: true,
    platforms: ["email"],
    description: "Before I send, flag the subject lines and phrases likely to trip spam filters and show me a rewrite beside them.",
  },
  {
    title: "Bounce clean-up",
    ready: true,
    platforms: ["email"],
    description: "After every campaign, pull the addresses that bounced out of the list so the next send isn't dragged down.",
  },
  {
    title: "Monthly list health report",
    ready: true,
    platforms: ["email"],
    description: "Every month, verify each list and tell me what share is valid, risky or dead, worst list first.",
  },
  {
    title: "Sender rotation",
    platforms: ["email"],
    description: "Spread a big send across my connected mailboxes so no single sender carries a volume spike.",
  },
  {
    title: "Pre-flight check",
    ready: true,
    platforms: ["email"],
    description: "Before anything goes out, check the list, the domain records and the copy, and hold the send if any of the three fails.",
  },
];
