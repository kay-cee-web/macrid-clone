import type { SkillDoc } from "@/types/skill";

export const OUTREACH_DOCS: Record<string, SkillDoc> = {
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
