import type { Idea } from "@/types/idea";

export const OUTREACH: Idea[] = [
  {
    title: "Case-study follow-up",
    platforms: ["email"],
    description: "Forty-eight hours after a lead doesn't reply, follow up with the case study closest to their business.",
  },
  {
    title: "Cold email drafting",
    ready: true,
    platforms: ["email"],
    description: "Before a campaign goes out, write the subject lines and bodies for that segment in my voice, each with a real reason to reply.",
  },
  {
    title: "Campaign launch",
    ready: true,
    platforms: ["email"],
    description: "When I pick a list, build the campaign from it and queue it through my connected mailbox with tracking on.",
  },
  {
    title: "WhatsApp window outreach",
    ready: true,
    platforms: ["whatsapp"],
    description: "Message the contacts who opened a conversation in the last 24 hours, and flag anyone who now needs an approved template.",
  },
  {
    title: "Non-reply chase",
    ready: true,
    platforms: ["email", "whatsapp"],
    description: "Three days after a campaign, follow up with everyone who didn't answer, on the channel they're most likely to read.",
  },
  {
    title: "Cold list warm-up",
    ready: true,
    platforms: ["email"],
    description: "Before a new list gets an offer, send a short intro sequence and hold back anyone who never opens it.",
  },
  {
    title: "Same-day first contact",
    platforms: ["whatsapp", "sms"],
    description: "When a prospect is added to a list, send the first message that same day instead of waiting for the next campaign.",
  },
  {
    title: "Channel per prospect",
    platforms: ["email", "sms", "whatsapp"],
    description: "For each prospect, send on the channel their record actually has (email, WhatsApp or SMS) rather than one blast to everyone.",
  },
  {
    title: "Auto-stop on reply",
    platforms: ["inbox"],
    description: "The moment someone answers, pull them out of every running sequence and hand the conversation to me.",
  },
  {
    title: "Best-hour send times",
    platforms: ["email", "sms"],
    description: "Schedule each send for the hour that list has historically opened most, per time zone.",
  },
  {
    title: "Inbound reply triage",
    platforms: ["inbox"],
    description: "As replies land, sort them (interested, not now, wrong person, unsubscribe) and put a draft response under each.",
  },
  {
    title: "Warm reply to deal",
    platforms: ["inbox"],
    description: "When a prospect replies with interest, create the deal, set its stage, and put the follow-up task on my calendar.",
  },
  {
    title: "No-show follow-up",
    platforms: ["email"],
    description: "When someone misses a booked call, mark it, draft the note offering a new time, and set the reminder.",
  },
  // Keeping sends out of spam: the checks that used to be Deliverability.
  {
    title: "Pre-send list verification",
    ready: true,
    platforms: ["email"],
    description: "Before a campaign goes out, verify the list and hold back every invalid, risky or catch-all address.",
  },
  {
    title: "Pre-flight check",
    ready: true,
    platforms: ["email"],
    description: "Before anything goes out, check the list, the domain records and the copy, and hold the send if any of the three fails.",
  },
  {
    title: "Bounce clean-up",
    ready: true,
    platforms: ["email"],
    description: "After every campaign, pull the addresses that bounced out of the list so the next send isn't dragged down.",
  },
  {
    title: "Sending domain watch",
    platforms: ["email"],
    description: "Every week, re-check SPF, DKIM and DMARC on my sending domains and tell me the moment one breaks.",
  },
  {
    title: "New sender warm-up",
    platforms: ["email"],
    description: "When I add a sender, ramp its volume gradually over its first weeks instead of sending everything at once.",
  },
  {
    title: "Spam placement alerts",
    platforms: ["email"],
    description: "Watch inbox placement per campaign and alert me as soon as one of my domains starts going to spam.",
  },
  {
    title: "Sender rotation",
    platforms: ["email"],
    description: "Spread a big send across my connected mailboxes so no single sender carries a volume spike.",
  },
  // Reading how sends did, to plan the next one.
  {
    title: "Channel comparison",
    ready: true,
    platforms: ["email", "whatsapp", "sms"],
    description: "Each month, compare replies and closed deals per channel and tell me where to put the next campaign.",
  },
  {
    title: "Send-time report",
    ready: true,
    platforms: ["email"],
    description: "Tell me which day and hour my sends do best, per list, and use it for the next schedule.",
  },
];
