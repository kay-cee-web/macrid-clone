import type { SkillDoc } from "@/types/skill";

export const FUNNELS_DOCS: Record<string, SkillDoc> = {
  "funnel-from-offer": {
    useCases: [
      "Launching an offer with nowhere to send traffic",
      "Testing a second angle on an offer that already works",
      "Replacing a page you built by hand and never finished",
    ],
    steps: [
      "Describe the offer, who it's for and what it costs.",
      "The agent builds the landing page, the thank-you page and the follow-up emails in your own colours and fonts.",
      "The set is handed back unpublished, so you read it before anyone else does.",
      "You publish it when it reads right.",
    ],
    output: "A funnel ready to publish, and its public URL once it is live.",
  },
  "headline-rewrite": {
    useCases: [
      "A page getting traffic but no sign-ups",
      "Reusing a funnel for a different audience",
      "Two angles you can't choose between",
    ],
    steps: [
      "Name the funnel, or paste the page URL.",
      "The agent reads the current headline, sub-head and call to action.",
      "It writes a new version and sets it beside the old one.",
      "Every change comes with the reason it was made.",
    ],
    output: "Old and new copy side by side, with the reasoning, ready to apply.",
  },
  "optin-handoff": {
    useCases: [
      "A form collecting names that nobody follows up",
      "Wiring a new funnel into the CRM",
      "Making sure every sign-up has a task and an owner",
    ],
    steps: [
      "Name the funnel and the list its sign-ups belong in.",
      "Each submission creates a lead and adds it to that list.",
      "The welcome sequence starts on the channel the contact gave you.",
      "A follow-up task is scheduled against the deal.",
    ],
    output: "A funnel whose sign-ups arrive as leads, sequenced, with a task waiting.",
  },
};
