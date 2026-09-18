import type { SkillDoc } from "@/types/skill";

export const GROWTH_DOCS: Record<string, SkillDoc> = {
  "pricing-review": {
    useCases: [
      "A price set once and never revisited",
      "Discounting on every deal by habit",
      "Adding a tier without guessing at it",
    ],
    steps: [
      "The agent sets what you charge against what it costs to deliver.",
      "It compares that with what the market charges for the same thing.",
      "It finds where you are under-charging and where you would lose people.",
      "It proposes the change and what it would mean over a year.",
    ],
    output: "A price-by-price review, with a recommended change and its effect.",
  },
  "referral-ask": {
    useCases: [
      "Happy customers nobody has ever asked",
      "Growth that costs nothing to try",
      "Asking without it feeling like a favour",
    ],
    steps: [
      "The agent finds customers who bought again, replied warmly, never complained.",
      "It ranks them by how well-placed they are to refer.",
      "It drafts an ask per person, referring to their own experience.",
      "Nothing sends until you have read them.",
    ],
    output: "A shortlist of people to ask, with a personal draft for each.",
  },
  "partner-hunt": {
    useCases: [
      "Selling to people someone else already reaches",
      "Growth without more ad spend",
      "Finding who to co-market with",
    ],
    steps: [
      "The agent works out who else sells to your customers without competing.",
      "It finds candidates and ranks them by audience overlap.",
      "It notes what each would get out of it, not just you.",
      "It drafts the first note to the best few.",
    ],
    output: "A ranked partner list, what's in it for them, and an opening note.",
  },
  "competitor-watch": {
    useCases: [
      "Losing deals to the same name every month",
      "A seller who needs an answer on the call, not after it",
      "Pricing a new offer against what exists",
    ],
    steps: [
      "Name the competitors, or let the agent find who you are up against.",
      "It compares what each sells, charges and promises.",
      "Where you are stronger and weaker is written plainly, both ways.",
      "It ends as a battlecard: their claim, your answer.",
    ],
    output: "A comparison table and a battlecard of claims and answers.",
  },
  "churn-prevention": {
    useCases: [
      "Customers who stopped replying but haven't left",
      "A cancellation you want a second try at",
      "Finding what the leavers had in common",
    ],
    steps: [
      "The agent finds contacts with no activity over a period you set.",
      "It looks for what the quiet ones share — plan, source, how they started.",
      "It ranks them by what they are worth keeping.",
      "It drafts a check-in or a save offer for each group.",
    ],
    output: "The at-risk list, what they have in common, and a message per group.",
  },
  "customer-research": {
    useCases: [
      "Guessing at what customers want instead of asking",
      "Wording a campaign in their language, not yours",
      "Deciding what to build next",
    ],
    steps: [
      "The agent writes the questions — short, open, and not leading.",
      "It sends them to a list and collects what comes back in one place.",
      "Answers are grouped by what they are really about.",
      "The phrases customers keep using are pulled out verbatim.",
    ],
    output: "The answers grouped by theme, plus the phrases worth reusing.",
  },
  "onboarding-flow": {
    useCases: [
      "New customers who sign up and then vanish",
      "A first week that is currently one welcome email",
      "Getting someone to the point where the product is useful",
    ],
    steps: [
      "Say what a customer has to do before your product pays off.",
      "The agent designs the first week around reaching that point.",
      "Each step gets a message, a channel and a day.",
      "It schedules the sequence and holds anyone who has already got there.",
    ],
    output: "A day-by-day first week, with every message written.",
  },
  "think-tank": {
    useCases: [
      "A decision you keep going round on",
      "Wanting the strongest argument against your plan",
      "Choosing between two options that both look fine",
    ],
    steps: [
      "State the decision and what you are optimising for.",
      "The agent argues it as several people: optimist, sceptic, customer, operator.",
      "Each position has to name what would change its mind.",
      "It ends with the case for, the case against, and what it would do.",
    ],
    output: "The debate in full, then a recommendation with its conditions.",
  },
};
