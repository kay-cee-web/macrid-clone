import type { SkillDoc } from "@/types/skill";

export const ANALYTICS_DOCS: Record<string, SkillDoc> = {
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
