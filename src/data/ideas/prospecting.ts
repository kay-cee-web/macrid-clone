import type { Idea } from "@/types/idea";

export const PROSPECTING: Idea[] = [
  {
    title: "Weekly prospect run",
    platforms: ["google_maps", "linkedin"],
    description: "Every Monday, search my niche and area, score the businesses I could sell to, and file the best of them into a fresh list.",
  },
  {
    title: "Contactable prospects only",
    platforms: ["google_maps"],
    description: "When a search finishes, drop the businesses with no phone, no email and no website so my list is only people I can actually contact.",
  },
  {
    title: "Decision-maker lookup",
    platforms: ["linkedin"],
    description: "For every company I capture, find the owner or marketing lead and attach their profile to the lead record.",
  },
  {
    title: "Lead detail enrichment",
    platforms: ["google_maps"],
    description: "When a lead lands without an email, phone or website, fill the gaps from its own site and public listings.",
  },
  {
    title: "Company background check",
    ready: true,
    platforms: [],
    description: "When I open a company, report its size, industry, revenue band and everyone else already on file there.",
  },
  {
    title: "Competitor audience watch",
    platforms: ["facebook"],
    description: "Every week, pull the businesses engaging with my competitors and add the ones that match my niche to a watch list.",
  },
  {
    title: "Duplicate merge on import",
    platforms: [],
    description: "Before anything is imported, check it against my existing lists and merge it into the record I already have.",
  },
  {
    title: "Stale list refresh",
    platforms: ["google_maps", "google_business"],
    description: "Every quarter, re-check an old list, drop the businesses that closed, and update the ones whose details changed.",
  },
];
