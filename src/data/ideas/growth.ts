import type { Idea } from "@/types/idea";

/** Keeping the customers you have and watching the market you sell into. */
export const GROWTH: Idea[] = [
  {
    title: "Pipeline digest",
    ready: true,
    platforms: [],
    description: "Every Monday, summarise the pipeline and flag the deals that haven't moved in two weeks with the next step on each.",
  },
  {
    title: "Churn risk alert",
    platforms: [],
    description: "When an active customer goes quiet for two weeks, draft a check-in and note what they last asked about.",
  },
  {
    title: "New signup welcome",
    platforms: ["email"],
    description: "When a new contact signs up, send a personal welcome with the three things worth doing first.",
  },
  {
    title: "Customer feedback digest",
    platforms: ["google_business", "email"],
    description: "Every Monday, gather last week's reviews and customer replies and summarise the themes worth acting on.",
  },
  {
    title: "Competitor watch",
    platforms: [],
    description: "Every week, check my competitors' sites and tell me when they ship a feature or change their pricing.",
  },
  {
    title: "Win-back run",
    platforms: ["email"],
    description: "Every quarter, find the customers who've gone quiet for months and draft the offer worth coming back for.",
  },
  {
    title: "Referral ask",
    platforms: ["email"],
    description: "After a deal closes well, wait a fortnight and draft the note asking who else they'd send my way.",
  },
  {
    title: "Upsell watch",
    ready: true,
    platforms: [],
    description: "Spot the customers who've outgrown what they bought and tell me what to offer each of them next.",
  },
  {
    title: "Review requests",
    platforms: ["google_business", "email"],
    description: "After a happy close, ask for the review and point them at the page where it counts.",
  },
  {
    title: "Why we lose",
    ready: true,
    platforms: [],
    description: "Every month, read the deals that went nowhere and tell me the reason that comes up most.",
  },
  {
    title: "Store health check",
    blocked: "a Shopify connector",
    platforms: ["shopify"],
    description: "Read my store's products, stock and orders, and flag what's running out and what's worth pushing.",
  },
];
