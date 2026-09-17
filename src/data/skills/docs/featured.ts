import type { SkillDoc } from "@/types/skill";

export const FEATURED_DOCS: Record<string, SkillDoc> = {
  "lead-sweep": {
    useCases: [
      "Building a list for a niche and city you haven't worked yet",
      "Topping up a list that has been sent to too often",
      "Checking whether a market is big enough before you commit to it",
    ],
    steps: [
      "Say the niche, the area and roughly how many businesses you want.",
      "The agent searches Google Maps and LinkedIn, and scores every result on how reachable it is and how ready to buy it looks.",
      "Listings with no phone, email or website are dropped, and obvious duplicates are merged.",
      "What survives is filed into a new list, named after the search that found it.",
    ],
    output: "A list you can send to, with a count of what was found, scored and dropped.",
  },
  "follow-up-run": {
    useCases: [
      "Turning a cold list into a three-touch sequence",
      "Following up a campaign without mailing the people who already replied",
      "Reaching contacts who have a phone number but no email address",
    ],
    steps: [
      "Name the list and the offer behind it.",
      "The agent writes the opener and two follow-ups, each rewritten for the channel that contact actually has.",
      "Anyone who replies is pulled out of the touches still to come.",
      "With \"Ask before sending\" on, every send waits for your go-ahead first.",
    ],
    output: "Three drafted messages per contact, the send schedule, and a running reply count.",
  },
  "inbox-check": {
    useCases: [
      "Before the first send to a bought or scraped list",
      "After changing DNS or adding a new sending domain",
      "When opens look fine but deliveries are falling",
    ],
    steps: [
      "Point the agent at a list, a sending domain, or both.",
      "Addresses are verified in batches; invalid, risky and catch-all ones are held back.",
      "SPF, DKIM and DMARC are re-checked on each sending domain.",
      "Fixes are ranked by how much sending each one is costing you.",
    ],
    output: "How much of the list survived, and a ranked list of what to fix first.",
  },
};
