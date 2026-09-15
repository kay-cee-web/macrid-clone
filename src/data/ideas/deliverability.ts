import type { Idea } from "@/types/idea";

export const DELIVERABILITY: Idea[] = [
  {
    title: "Pre-send list verification",
    blocked: "an email verification provider",
    platforms: ["email"],
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
];
