import type { PillTone } from "@/components/ui/Pill";

export type ShowcaseRun = {
  /** The agent that reported it, so the card is attributed to work, not to a person. */
  agent: string;
  role: string;
  area: string;
  tone: PillTone;
  quote: string;
};

/**
 * Illustrative runs for the sign-in artwork. Deliberately agent reports rather
 * than customer testimonials: nothing here should read as a real endorsement.
 */
export const SHOWCASE_RUNS: ShowcaseRun[] = [
  {
    agent: "Vesper",
    role: "Prospecting agent",
    area: "Prospect Finder",
    tone: "accent",
    quote:
      "Found 42 dental clinics in Austin with no website. 31 had a phone number, so I saved those to a new list and left the rest out.",
  },
  {
    agent: "Zephyr",
    role: "Outreach agent",
    area: "Outreach · WhatsApp",
    tone: "good",
    quote:
      "Sent 38 intros this morning and 6 have replied. Two numbers bounced, so I took them off the list before the follow-up.",
  },
  {
    agent: "Marlow",
    role: "Pipeline agent",
    area: "CRM",
    tone: "neutral",
    quote:
      "Added 31 leads, moved 4 deals to Proposal and booked 3 calls for Thursday. Every task now has a next action and a date.",
  },
  {
    agent: "Ora",
    role: "Deliverability agent",
    area: "Deliverability",
    tone: "warn",
    quote:
      "Checked 120 addresses before the send: 9 invalid, 4 risky. I held the campaign until you say whether to drop them.",
  },
];
