import type { SkillDoc } from "@/types/skill";

export const DELIVERABILITY_DOCS: Record<string, SkillDoc> = {
  "verify-list": {
    useCases: [
      "Before the first send to a list you didn't build yourself",
      "After a jump in bounces",
      "Cleaning a list that has sat unused for months",
    ],
    steps: [
      "Name the list to verify.",
      "Addresses are checked in batches of ten.",
      "Invalid, risky and catch-all addresses are held back from sending.",
      "The rest stay in the list, marked as verified.",
    ],
    output: "How much of the list survived, and the reason for each rejection.",
  },
  "domain-check": {
    useCases: [
      "After moving DNS or changing host",
      "Adding a new sending domain",
      "Deliveries falling with no obvious cause",
    ],
    steps: [
      "The agent re-checks SPF, DKIM and DMARC on every sending domain.",
      "Each failure is explained in terms of what it actually breaks.",
      "Fixes are ranked by how much sending they cost you.",
      "Domains that are fine are confirmed, not just skipped over.",
    ],
    output: "A verdict per domain, and a ranked list of fixes.",
  },
  "spam-words": {
    useCases: [
      "Before a campaign goes to a big list",
      "Copy written by somebody else",
      "A subject line you are not sure about",
    ],
    steps: [
      "Point the agent at the campaign, or paste the copy in.",
      "It flags the subject lines and phrases likely to trip filters.",
      "Each flag comes with a rewrite that keeps the meaning.",
      "Nothing is changed until you accept it.",
    ],
    output: "A flag-and-rewrite list, ordered by how much each one risks.",
  },
};
