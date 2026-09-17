import type { SkillDoc } from "@/types/skill";

export const PROSPECTING_DOCS: Record<string, SkillDoc> = {
  "prospect-sweep": {
    useCases: [
      "Opening a new city or vertical",
      "Rebuilding a list that has gone stale",
      "Sizing a market before you spend anything on it",
    ],
    steps: [
      "Give the niche, the area and a target count.",
      "The agent searches Google Maps, LinkedIn and Facebook for businesses that match.",
      "Each result is scored on how reachable it is and how ready to buy it looks.",
      "The best of them are filed into a fresh list.",
    ],
    output: "A scored list, with the search that produced it recorded in its description.",
  },
  "reachable-only": {
    useCases: [
      "Cleaning a captured list before the first send",
      "Cutting a bought list down to the part you can contact",
      "Spotting listings for businesses that have quietly closed",
    ],
    steps: [
      "Name the list to clean.",
      "Records with no phone, no email and no website are separated out.",
      "Listings that look abandoned — no hours, no reviews in years — are flagged rather than deleted.",
      "What's left is only records you can actually reach.",
    ],
    output: "The cleaned list, plus what was dropped and what was only flagged.",
  },
  "decision-maker": {
    useCases: [
      "Putting a name to a company before the first message",
      "Finding the marketing lead at an agency",
      "Filling in blank contacts on an imported list",
    ],
    steps: [
      "Name the list of companies.",
      "For each one, the agent looks for the owner or the marketing lead.",
      "The profile it finds is attached to that lead record.",
      "Companies where nobody could be found are reported separately.",
    ],
    output: "Lead records with a named person on them, and the companies still missing one.",
  },
};
