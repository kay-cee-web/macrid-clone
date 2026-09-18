import type { Idea } from "@/types/idea";

/** The day's own admin: briefings, prep and the inbox, rather than customer work. */
export const WORK: Idea[] = [
  {
    title: "Morning briefing",
    platforms: ["email"],
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
    platforms: ["email"],
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
    blocked: "a Jira connector",
    platforms: [],
    description: "When a ticket is assigned to me, send me the details and whatever context you can find on it.",
  },
  {
    title: "PR review reminder",
    blocked: "a GitHub connector",
    platforms: [],
    description: "When a review assigned to me has sat two hours, remind me with a direct link to it.",
  },
  {
    title: "Time-blocked day",
    ready: true,
    platforms: [],
    description: "When I list what's on my plate, turn it into a day with times against it, built around the meetings already booked.",
  },
];
