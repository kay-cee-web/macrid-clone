import type { SkillDoc } from "@/types/skill";

export const PROSPECTING_DOCS: Record<string, SkillDoc> = {
  "list-enrich": {
    useCases: [
      "A bought list that is half empty",
      "Rows with a name and nothing else",
      "Knowing what a list is worth before you send to it",
    ],
    steps: [
      "The agent works through the list row by row.",
      "It fills the gaps it can find: website, phone, city, who runs it.",
      "Rows that cannot be completed are marked, not deleted.",
      "It says what share of the list is now actually contactable.",
    ],
    output: "The list filled in, with the unsaveable rows flagged and counted.",
  },
  "dedupe-lists": {
    useCases: [
      "The same business sitting in three lists",
      "Two spellings of one company name",
      "Before a send, so nobody gets it twice",
    ],
    steps: [
      "The agent compares records across the lists you name.",
      "Near-matches are shown to you before anything merges.",
      "Merging keeps the fullest version of every field.",
      "It reports how many records the lists actually held.",
    ],
    output: "One clean list, and a note of what was merged into what.",
  },
  "score-and-rank": {
    useCases: [
      "A list too long to send to all at once",
      "Deciding who gets the first hundred sends",
      "Separating fit from readiness",
    ],
    steps: [
      "Say what a good customer looks like for you.",
      "The agent scores fit and readiness separately.",
      "The list is ordered by the two together.",
      "It explains what pushed the top and bottom rows where they are.",
    ],
    output: "The list ranked, with the reasoning behind the top and bottom.",
  },
  "nearby-expansion": {
    useCases: [
      "A search that worked and should run wider",
      "Running out of names in one town",
      "Growing a list without buying one",
    ],
    steps: [
      "Name the search that is working and how far to spread.",
      "The agent runs it on the surrounding areas.",
      "Anything already in your lists is dropped before saving.",
      "New names go into their own list, per area.",
    ],
    output: "A list per new area, holding only businesses you did not already have.",
  },
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
