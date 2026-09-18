import type { Idea } from "@/types/idea";

/**
 * Finding things out. Most of this needs more of the open web than the agent's
 * tools reach today, so little of it is marked ready.
 */
export const RESEARCH: Idea[] = [
  {
    title: "ICP from my own customers",
    ready: true,
    platforms: [],
    description: "Read my closed deals and describe the customer worth chasing: size, industry, place and what set them off.",
  },
  {
    title: "Product research",
    platforms: [],
    description: "When I share a use case, budget and must-haves, compare the options on features, pricing and reviews and recommend one.",
  },
  {
    title: "Competitor comparison",
    platforms: ["facebook", "linkedin"],
    description: "Every month, research my competitors on pricing and features and return a comparison table showing where I win and where I lose.",
  },
  {
    title: "Market snapshot",
    platforms: ["google_maps"],
    description: "When I name a niche and a place, tell me how many businesses are in it, what they charge and who leads.",
  },
  {
    title: "Knowledge search",
    platforms: [],
    description: "When I ask a question about my own files, search them and answer with citations, flagging anything it could not find.",
  },
  {
    title: "Question, answered with sources",
    platforms: [],
    description: "When I ask something I'd otherwise search for, answer it and show where each part came from.",
  },
  {
    title: "Before the call",
    ready: true,
    platforms: [],
    description: "Before I meet a company, gather what we know about them and what I should have read first.",
  },
  {
    title: "Pricing sense check",
    platforms: [],
    description: "When I'm setting a price, tell me what comparable businesses charge and where mine sits.",
  },
  {
    title: "Objection library",
    ready: true,
    platforms: [],
    description: "Read my replies and write down the objections that keep coming back, with the answer that worked.",
  },
  {
    title: "Territory sizing",
    platforms: ["google_maps"],
    description: "Before I open a new area, count the businesses worth selling to and say whether it's worth the run.",
  },
  {
    title: "Academic sources",
    platforms: [],
    description: "When a question deserves proper sources, gather the credible ones, say where they disagree, and cite every claim.",
  },
  {
    title: "User research themes",
    ready: true,
    platforms: [],
    description: "Turn interviews, replies and reviews into themes ranked by how often they came up, with the quote that says each one best.",
  },
];
