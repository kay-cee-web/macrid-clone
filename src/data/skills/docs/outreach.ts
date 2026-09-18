import type { SkillDoc } from "@/types/skill";

export const OUTREACH_DOCS: Record<string, SkillDoc> = {
  "reply-triage": {
    useCases: [
      "More replies than you can read in one sitting",
      "Someone asking to be left alone",
      "Warm answers going cold while they queue",
    ],
    steps: [
      "The agent reads what came back and sorts it three ways.",
      "Anyone who asked to stop is pulled out of every sequence first.",
      "Interested replies get a draft answer, ready to send.",
      "\"Not now\" replies get a date and a reminder instead.",
    ],
    output: "Replies sorted, opt-outs honoured, and a draft per interested contact.",
  },
  "whatsapp-broadcast": {
    useCases: [
      "A list that answers on WhatsApp but not by email",
      "A short announcement that needs to land today",
      "Reaching numbers you have but no address for",
    ],
    steps: [
      "The agent picks an approved template that fits the message.",
      "It fills the variables per contact and shows you one filled-in example.",
      "It sends only to contacts with a usable number.",
      "It reports who it reached and who it could not.",
    ],
    output: "The broadcast sent, with delivered and failed counted per contact.",
  },
  "test-before-send": {
    useCases: [
      "Before any campaign goes to a real list",
      "A merge tag that might render as raw text",
      "Checking it on a phone, not just a laptop",
    ],
    steps: [
      "The agent sends the campaign to you alone first.",
      "It checks merge tags fill, links open, and the unsubscribe is there.",
      "It flags anything that breaks at phone width.",
      "Nothing goes to the list until you say the test looked right.",
    ],
    output: "A test send, plus a list of what would have gone out broken.",
  },
  "campaign-plan": {
    useCases: [
      "A send that needs agreeing before it is written",
      "Running the same campaign across three channels",
      "Knowing afterwards whether it worked",
    ],
    steps: [
      "Say what the campaign is for and who it is going to.",
      "The agent writes the objective, the audience and the message per channel.",
      "It lays the sends onto dates, with the follow-ups spaced.",
      "It states up front what result would count as success.",
    ],
    output: "A one-page brief: objective, audience, messages, dates and the success mark.",
  },
  "chase-non-repliers": {
    useCases: [
      "A campaign with opens but no replies",
      "Reaching the people who ignored the first email",
      "A second touch on a list you don't want to burn",
    ],
    steps: [
      "Name the campaign that went out.",
      "Everyone who didn't answer is separated from those who did.",
      "Each gets a message that builds on the first instead of repeating it.",
      "It goes out on the channel that contact is most likely to read.",
    ],
    output: "A follow-up send with per-channel counts, and the repliers left alone.",
  },
  "warm-a-list": {
    useCases: [
      "A cold or bought list you don't want to pitch straight away",
      "Protecting a new sending domain from a cold blast",
      "Finding out who is actually listening before the offer",
    ],
    steps: [
      "Name the list and the offer you're building towards.",
      "A short intro sequence goes out with nothing to buy in it.",
      "Contacts who never open are held back from the offer.",
      "The offer then goes only to the ones who engaged.",
    ],
    output: "An engaged segment ready for the offer, and the cold remainder parked.",
  },
  "channel-per-contact": {
    useCases: [
      "A list where only half the records have an email address",
      "Reaching contacts who only ever answer their phone",
      "One announcement that has to go out across email, WhatsApp and SMS",
    ],
    steps: [
      "Name the list and give the message once.",
      "Records are split by what they actually have: email, WhatsApp or SMS.",
      "The message is rewritten for the length and tone each channel expects.",
      "Each split sends on its own channel.",
    ],
    output: "One message delivered three ways, with a count per channel.",
  },
};
