import type { Idea } from "@/types/idea";

export const ANALYTICS: Idea[] = [
  {
    title: "Monday performance brief",
    ready: true,
    platforms: [],
    description: "Every Monday, sum up last week's sends, replies and closed deals in one short report I can read in a minute.",
  },
  {
    title: "Channel comparison",
    ready: true,
    platforms: ["email", "whatsapp", "sms"],
    description: "Each month, compare replies and closed deals per channel and tell me where to put the next campaign.",
  },
  {
    title: "Underperformance breakdown",
    ready: true,
    platforms: ["email"],
    description: "When a campaign underperforms, break down what likely caused it and what I should change first.",
  },
  {
    title: "Cost per lead tracking",
    platforms: [],
    description: "Every week, work out what each list cost me per lead and per closed deal, and rank them.",
  },
  {
    title: "Top-performing copy",
    ready: true,
    platforms: ["email"],
    description: "Each quarter, find the subject lines and headlines that earned the most replies and show me the pattern behind them.",
  },
  {
    title: "Metric dip alerts",
    blocked: "Slack",
    platforms: [],
    description: "Watch my open, reply and conversion rates daily and tell me as soon as one falls out of its usual range.",
  },
];
