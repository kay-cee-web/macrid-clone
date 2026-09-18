import type { Idea } from "@/types/idea";

/** Pipeline handling: deals, contacts and the calendar behind them. */
export const CRM: Idea[] = [
  {
    title: "Deal stage upkeep",
    ready: true,
    platforms: [],
    description: "As deals move, create them, shift them between stages, and keep the next action and close date current.",
  },
  {
    title: "Warm reply to deal",
    platforms: ["email"],
    description: "When a prospect replies with interest, create the deal, set its stage, and put the follow-up task on my calendar.",
  },
  {
    title: "Appointment booking",
    ready: true,
    platforms: [],
    description: "When someone asks for a time, check what's free, book the appointment and send the confirmation back.",
  },
  {
    title: "Follow-up task on every promise",
    ready: true,
    platforms: [],
    description: "After each call or reply, create the follow-up task with a due date so nothing I said I'd do gets lost.",
  },
  {
    title: "Monthly contact cleanup",
    platforms: [],
    description: "Every month, merge duplicate contacts, fix broken records, and archive the ones that have gone cold.",
  },
  {
    title: "Lead scoring by intent",
    platforms: [],
    description: "Score every lead on what they've opened and clicked, and move the hottest ones into their own list.",
  },
  {
    title: "Day's calendar brief",
    ready: true,
    platforms: [],
    description: "Every morning, list today's appointments with who each one is with and what we last agreed.",
  },
  {
    title: "Reschedule without the back-and-forth",
    ready: true,
    platforms: [],
    description: "When someone asks to move a meeting, find a time that works, move it and confirm it.",
  },
  {
    title: "Segment a list",
    ready: true,
    platforms: [],
    description: "When I describe the people I want, build the list from my records and tell me how many made it in.",
  },
  {
    title: "No-show follow-up",
    platforms: ["email"],
    description: "When someone misses a booked call, mark it, draft the note offering a new time, and set the reminder.",
  },
];
