import type { Idea } from "@/types/idea";

export const BUSINESS: Idea[] = [
  {
    title: "Social content per platform",
    platforms: ["facebook", "linkedin"],
    description: "When I give you a campaign goal and a platform, draft the post ideas, hooks and captions in my brand voice and hold them for approval.",
  },
  {
    title: "SEO content briefs",
    platforms: [],
    description: "When I pick a keyword and audience, turn it into a full brief: on-page metadata, heading outline and a first draft.",
  },
  {
    title: "Competitor comparison",
    platforms: ["facebook", "linkedin"],
    description: "Every month, research my competitors on pricing and features and return a comparison table showing where I win and where I lose.",
  },
  {
    title: "Product research",
    platforms: [],
    description: "When I share a use case, budget and must-haves, compare the options on features, pricing and reviews and recommend one.",
  },
  {
    title: "Knowledge search",
    platforms: [],
    description: "When I ask a question about my own files, search them and answer with citations, flagging anything it could not find.",
  },
  {
    title: "Email triage",
    platforms: ["email"],
    description: "As mail lands, rank it by priority, flag the urgent requests and follow-ups, and put a context-aware draft under each.",
  },
  {
    title: "Call analysis",
    platforms: [],
    description: "After a sales or support call, turn the transcript into a briefing: summary, needs, objections, decisions and action items.",
  },
];
