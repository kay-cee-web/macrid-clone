import type { Idea } from "@/types/idea";

export const CRM: Idea[] = [
  {
    title: "Deal stage upkeep",
    ready: true,
    platforms: [],
    description: "As deals move, create them, shift them between stages, and keep the next action and close date current.",
  },
  {
    title: "Stalled deal review",
    ready: true,
    platforms: [],
    description: "Every Monday, flag the deals that haven't moved in two weeks and tell me what the next step on each should be.",
  },
  {
    title: "Warm reply to deal",
    platforms: ["email"],
    description: "When a prospect replies with interest, create the deal, set its stage, and put the follow-up task on my calendar.",
  },
  {
    title: "Pre-call briefings",
    ready: true,
    platforms: [],
    description: "An hour before a meeting, summarise everything we've sent that contact and everything they've done since.",
  },
  {
    title: "Monthly contact cleanup",
    platforms: [],
    description: "Every month, merge duplicate contacts, fix broken records, and archive the ones that have gone cold.",
  },
  {
    title: "Daily task reminders",
    platforms: [],
    description: "Every morning, remind me of the tasks due today and the ones I've already pushed back twice.",
  },
  {
    title: "Lead scoring by intent",
    platforms: [],
    description: "Score every lead on what they've opened and clicked, and move the hottest ones into their own list.",
  },
  {
    title: "Quiet customer watch",
    platforms: [],
    description: "When an active customer goes quiet for two weeks, draft a check-in and note what they last asked about.",
  },
];
