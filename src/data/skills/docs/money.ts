import type { SkillDoc } from "@/types/skill";

export const MONEY_DOCS: Record<string, SkillDoc> = {
  "quote-builder": {
    useCases: [
      "A scope that keeps turning into a negotiation",
      "Quoting the same kind of job over and over",
      "Giving a choice instead of a number",
    ],
    steps: [
      "Describe the work and anything you will not include.",
      "The agent builds two or three options at different scopes.",
      "Each states what is in, what is out, and what it costs.",
      "It writes the covering note that goes with them.",
    ],
    output: "A quote with options, exclusions stated, and the note to send it with.",
  },
  "spend-review": {
    useCases: [
      "A card statement nobody reads line by line",
      "Costs that grew without a decision",
      "Knowing what the tools actually cost",
    ],
    steps: [
      "The agent gathers the month's charges from the inbox.",
      "It groups them by what they were for.",
      "Each group is set against the same month before.",
      "The three that grew most are named, with what changed.",
    ],
    output: "The month's spend grouped, compared, with the three growers named.",
  },
  "deal-to-invoice": {
    useCases: [
      "Work delivered that was never billed",
      "A month where revenue looks lower than it felt",
      "Checking the books against the pipeline",
    ],
    steps: [
      "The agent lists every deal marked won in the period.",
      "It matches each against an invoice in the inbox.",
      "Deals with no matching bill are listed with their value.",
      "It drafts the invoice email for the ones you confirm.",
    ],
    output: "The unbilled deals, their value, and a draft bill for each.",
  },
  "tax-set-aside": {
    useCases: [
      "A tax bill that always arrives as a surprise",
      "Money spent because it looked like profit",
      "Knowing what is actually yours to spend",
    ],
    steps: [
      "Say what share of income to hold back.",
      "The agent applies it to each payment that lands.",
      "It keeps a running total of what is set aside and what is owed.",
      "It reminds you before the date the bill is due.",
    ],
    output: "A running set-aside total, and a reminder before the due date.",
  },
  "revenue-report": {
    useCases: [
      "A month-end number you would rather not add up",
      "Knowing which campaign actually earned its keep",
      "Spotting a decline while it is still small",
    ],
    steps: [
      "The agent totals closed deals and campaign revenue for the period.",
      "It splits the total by source, list and channel.",
      "The period is set against the one before it.",
      "What is growing and what is shrinking are both named.",
    ],
    output: "The month's revenue, split by source, with the movers called out.",
  },
  "invoice-chase": {
    useCases: [
      "Money owed that nobody has followed up",
      "Chasing without damaging the relationship",
      "Knowing which unpaid invoice to start with",
    ],
    steps: [
      "The agent finds the unpaid invoices in the inbox and the deal records.",
      "They are ordered by size and by how long they have been outstanding.",
      "It drafts a chase for each, matched to how late it is.",
      "Nothing sends until you have read the drafts.",
    ],
    output: "The outstanding list in priority order, with a chase drafted for each.",
  },
  "financial-model": {
    useCases: [
      "A projection you need before a conversation about money",
      "Testing whether a price change carries the costs",
      "Knowing how long the runway actually is",
    ],
    steps: [
      "Give what you charge, roughly what it costs, and what you spend monthly.",
      "The agent projects revenue, costs and cash over twelve months.",
      "It runs a cautious, an expected and an optimistic case.",
      "Every assumption is listed separately, so you can change one and re-run.",
    ],
    output: "A twelve-month projection in three cases, with the assumptions listed.",
  },
  "renewal-watch": {
    useCases: [
      "Subscriptions that renew before you notice",
      "A yearly charge you meant to cancel",
      "Knowing what the tools actually cost each month",
    ],
    steps: [
      "The agent collects renewals from the inbox and anything you list by hand.",
      "Each gets its cost, its cycle and its next charge date.",
      "It totals the monthly and yearly spend.",
      "It schedules a reminder for the week before each charge.",
    ],
    output: "One list of renewals with costs and dates, plus reminders set.",
  },
};
