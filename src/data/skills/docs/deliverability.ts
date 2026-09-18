import type { SkillDoc } from "@/types/skill";

export const DELIVERABILITY_DOCS: Record<string, SkillDoc> = {
  "warmup-plan": {
    useCases: [
      "A brand new domain or mailbox",
      "Coming back after a long quiet spell",
      "Before a big send from an untested sender",
    ],
    steps: [
      "The agent plans the daily volume, starting small.",
      "Early sends go to your most engaged contacts first.",
      "Volume only rises while bounces and complaints stay low.",
      "It says when the sender is ready for the full list.",
    ],
    output: "A day-by-day ramp, and the point at which it is safe to open up.",
  },
  "bounce-cleanup": {
    useCases: [
      "A list that bounces more every send",
      "Protecting a sender before it gets flagged",
      "Knowing what a list is really worth",
    ],
    steps: [
      "The agent reads the bounces from recent sends.",
      "Hard bounces come off the list permanently.",
      "Soft bounces are held aside for one retry.",
      "It reports the list's real size afterwards.",
    ],
    output: "A cleaned list, with hard and soft bounces counted separately.",
  },
  "unsubscribe-audit": {
    useCases: [
      "Making sure opt-outs actually stuck",
      "A campaign that may have gone out without a link",
      "Before sending to a list you inherited",
    ],
    steps: [
      "The agent checks every campaign carries a working unsubscribe.",
      "It looks for people who opted out and are still on a list.",
      "Anyone found is removed everywhere, not just where they left.",
      "It reports what it fixed and what needs a human decision.",
    ],
    output: "Opt-outs honoured across every list, and the gaps that were found.",
  },
  "sender-check": {
    useCases: [
      "Several mailboxes and no rule for which to use",
      "A from-name that says nothing to the recipient",
      "Replies going to an address nobody reads",
    ],
    steps: [
      "The agent goes through each connected sending account.",
      "It checks from-name, reply-to, signature and connection.",
      "Anything misconfigured is named with what it costs.",
      "It recommends which sender suits which kind of message.",
    ],
    output: "A per-sender check, and which one to use for what.",
  },
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
