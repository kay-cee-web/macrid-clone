import type { SkillDoc } from "@/types/skill";

export const ANALYTICS_DOCS: Record<string, SkillDoc> = {
  "campaign-postmortem": {
    useCases: [
      "A campaign that underperformed and nobody knows why",
      "One that worked, and you want to repeat it",
      "Before writing the next version of the same send",
    ],
    steps: [
      "The agent takes one campaign and follows it end to end.",
      "It marks where people dropped: delivery, open, click, reply.",
      "Each drop is compared against your own usual rates.",
      "It names the two changes most likely to move the next one.",
    ],
    output: "The campaign's funnel, where it lost people, and two changes to make.",
  },
  "list-quality": {
    useCases: [
      "Lists judged by size rather than by replies",
      "Deciding which list to send the next offer to",
      "Retiring a list that only generates bounces",
    ],
    steps: [
      "The agent scores every list on replies, bounces and opt-outs.",
      "Lists are compared on rates, not on how big they are.",
      "It names which are worth sending to again.",
      "It says which should be retired, and what that costs you.",
    ],
    output: "Lists ranked by what they return, with retire recommendations.",
  },
  "funnel-stats": {
    useCases: [
      "Funnels running with nobody reading the numbers",
      "Deciding which page is worth rewriting",
      "Checking whether a change actually helped",
    ],
    steps: [
      "The agent reads views, clicks and conversion per funnel.",
      "It works out where visitors leave each one.",
      "Pages are ranked by what fixing them would be worth.",
      "Recent changes are set against the period before them.",
    ],
    output: "Per-funnel numbers, the drop-off points, and what to fix first.",
  },
  "sms-delivery": {
    useCases: [
      "Texts that were sent but maybe not delivered",
      "Working out what SMS really costs per reply",
      "Numbers that fail every single time",
    ],
    steps: [
      "The agent reads the delivery log behind a campaign.",
      "Delivered, pending and failed are counted separately.",
      "Failures are grouped by the reason given.",
      "It totals the cost and divides it by what was delivered.",
    ],
    output: "Delivery rates, failure reasons, and cost per delivered message.",
  },
  "best-send-time": {
    useCases: [
      "Sending whenever you happen to be at the desk",
      "A list spread over several time zones",
      "Scheduling the next campaign properly",
    ],
    steps: [
      "The agent reads when opens and replies actually happened.",
      "It separates that from when things were sent.",
      "Patterns are checked by day and by hour.",
      "It gives the hours worth scheduling into, and the ones to avoid.",
    ],
    output: "The hours that earn replies, and the ones that waste sends.",
  },
  "week-in-review": {
    useCases: [
      "A Monday summary you would rather not assemble by hand",
      "Reporting to someone who never opens the app",
      "Catching a bad week while you can still fix it",
    ],
    steps: [
      "The agent totals the week's sends, opens, replies and closed deals.",
      "It names the campaign that earned the most of them.",
      "It sets the week against the one before it.",
      "Anything that moved sharply is called out.",
    ],
    output: "A short report: the week's totals, the best campaign, and what changed.",
  },
  "channel-scorecard": {
    useCases: [
      "Deciding where the next campaign should go",
      "Justifying what a channel costs",
      "Comparing SMS against email honestly",
    ],
    steps: [
      "Give the period to compare.",
      "Email, WhatsApp and SMS are scored on replies and closed deals, not opens.",
      "What each channel cost is set against what it returned.",
      "It says where the next campaign should go.",
    ],
    output: "A scorecard per channel, with a recommendation.",
  },
  "cost-per-lead": {
    useCases: [
      "Lists that cost real money to build",
      "Choosing which source to buy more from",
      "Cutting a source that is quietly losing money",
    ],
    steps: [
      "Name the lists to compare.",
      "The agent works out cost per lead and cost per closed deal for each.",
      "Lists are ranked on what they actually returned.",
      "Sources that lose money are named.",
    ],
    output: "A ranked table of lists, by cost per lead and per closed deal.",
  },
};
