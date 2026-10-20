import type { Idea } from "@/types/idea";

/** The day's own admin: briefings, prep and the inbox, rather than customer work. */
export const WORK: Idea[] = [
  {
    title: "Morning briefing",
    platforms: ["inbox", "calendar"],
    description: "Every morning, digest my unread mail, today's meetings and the tasks due, in that order, as one short note.",
  },
  {
    title: "Meeting prep",
    ready: true,
    platforms: [],
    description: "Half an hour before a meeting, summarise everything we've sent that contact and everything they've done since.",
  },
  {
    title: "End of day wrap-up",
    ready: true,
    platforms: [],
    description: "Every evening, summarise what got done today and draft tomorrow's list from what's still open.",
  },
  {
    title: "Daily task reminders",
    platforms: [],
    description: "Every morning, remind me of the tasks due today and the ones I've already pushed back twice.",
  },
  {
    title: "Unanswered email nudge",
    platforms: ["inbox"],
    description: "When a reply has sat unanswered for a day, remind me with a one-line summary of what it was about.",
  },
  {
    title: "Email triage",
    platforms: ["email"],
    description: "As mail lands, rank it by priority, flag the urgent requests and follow-ups, and put a context-aware draft under each.",
  },
  {
    title: "Call analysis",
    platforms: [],
    description: "After a sales or support call, turn the transcript into a briefing: summary, needs, objections, decisions and action items.",
  },
  {
    title: "New ticket alert",
    platforms: ["jira"],
    description: "When a ticket is assigned to me, send me the details and whatever context you can find on it.",
  },
  {
    title: "PR review reminder",
    platforms: ["github"],
    description: "When a review assigned to me has sat two hours, remind me with a direct link to it.",
  },
  {
    title: "Time-blocked day",
    ready: true,
    platforms: [],
    description: "When I list what's on my plate, turn it into a day with times against it, built around the meetings already booked.",
  },
  {
    title: "Day's calendar brief",
    ready: true,
    platforms: [],
    description: "Every morning, list today's appointments with who each one is with and what we last agreed.",
  },
  {
    title: "Appointment booking",
    ready: true,
    platforms: [],
    description: "When someone asks for a time, check what's free, book the appointment and send the confirmation back.",
  },
  {
    title: "Reschedule without the back-and-forth",
    ready: true,
    platforms: [],
    description: "When someone asks to move a meeting, find a time that works, move it and confirm it.",
  },
  {
    title: "Follow-up task on every promise",
    ready: true,
    platforms: [],
    description: "After each call or reply, create the follow-up task with a due date so nothing I said I'd do gets lost.",
  },
  {
    title: "Monday performance brief",
    ready: true,
    platforms: [],
    description: "Every Monday, sum up last week's sends, replies and closed deals in one short report I can read in a minute.",
  },
];
