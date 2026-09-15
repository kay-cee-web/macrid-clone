import type { Idea } from "@/types/idea";

export const OUTREACH: Idea[] = [
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
    platforms: ["email"],
    description: "The moment someone answers, pull them out of every running sequence and hand the conversation to me.",
  },
  {
    title: "Best-hour send times",
    platforms: ["email", "sms"],
    description: "Schedule each send for the hour that list has historically opened most, per time zone.",
  },
  {
    title: "Inbound reply triage",
    platforms: ["email"],
    description: "As replies land, sort them (interested, not now, wrong person, unsubscribe) and put a draft response under each.",
  },
  {
    title: "Unanswered reply nudge",
    platforms: ["email"],
    description: "When a reply has sat unanswered for a day, remind me with a one-line summary of what it was about.",
  },
];
