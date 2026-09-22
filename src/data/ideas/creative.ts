import type { Idea } from "@/types/idea";

/** Making the words and pictures: Macrid's content generator, widened. */
export const CREATIVE: Idea[] = [
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
    title: "Repurpose one piece",
    ready: true,
    platforms: [],
    description: "When I share an article or a recording, turn it into posts, a newsletter and a short script, each in my voice.",
  },
  {
    title: "Brand voice guide",
    ready: true,
    platforms: [],
    description: "From my best emails and pages, write the voice guide every new piece of copy should follow.",
  },
  {
    title: "Ad angles",
    ready: true,
    platforms: [],
    description: "For one offer, write five ads that each sell it from a different angle, and say who each one is for.",
  },
  {
    title: "Campaign visuals",
    blocked: "an image tool for agents",
    platforms: ["image_generation"],
    description: "When a campaign is written, generate the images to go with it in my colours and sizes.",
  },
  {
    title: "Weekly post queue",
    platforms: ["facebook", "linkedin"],
    description: "Every Monday, draft the week's posts from what I'm working on and hold them for me to approve.",
  },
  {
    title: "Newsletter from the month",
    ready: true,
    platforms: ["email"],
    description: "At the end of each month, turn what actually happened into a newsletter people would finish.",
  },
  {
    title: "Case study from a win",
    ready: true,
    platforms: [],
    description: "When a deal closes well, write the case study: the problem, what we did, and the numbers.",
  },
  {
    title: "Reply in my voice",
    ready: true,
    platforms: [],
    description: "When I paste something I have to answer, draft the reply the way I'd write it, not the way a robot would.",
  },
];
