import type { Idea } from "@/types/idea";

/**
 * Standing reminders for home and health. The agent runs these with
 * `schedule_automation` and messages you on whichever channel is paired, so
 * none is marked ready until a channel exists. Study routines live in
 * `education.ts`.
 */
export const REMINDERS: Idea[] = [
  {
    title: "Bill due alert",
    platforms: ["email"],
    description: "Three days before a bill is due, remind me with the amount and a link to pay it.",
  },
  {
    title: "Package arrival watch",
    platforms: ["email"],
    description: "When a tracking number says delivered, tell me straight away.",
  },
  {
    title: "Grocery reminder",
    platforms: [],
    description: "Every Sunday evening, remind me what's running low and draft the week's shopping list.",
  },
  {
    title: "Weekly meal plan",
    platforms: [],
    description: "Every Saturday morning, draft a meal plan for the week and the shopping list that goes with it.",
  },
  {
    title: "Trash day reminder",
    platforms: [],
    description: "Every Sunday evening, remind me which bins go out for the morning collection.",
  },
  {
    title: "Cleaning schedule",
    platforms: [],
    description: "Every day, send me one rotating cleaning job so the house keeps up with itself.",
  },
  {
    title: "Birthday heads-up",
    platforms: ["email"],
    description: "A week before a birthday I've told you about, remind me and suggest something to send.",
  },
  {
    title: "Renewal watch",
    platforms: ["email"],
    description: "Before anything renews — insurance, a licence, a subscription — tell me while I can still change it.",
  },
  {
    title: "Hydration reminder",
    platforms: [],
    description: "Every two hours during the workday, nudge me to drink a glass of water.",
  },
  {
    title: "Movement break",
    platforms: [],
    description: "Every 90 minutes, suggest a short stretch or a walk to break up the sitting.",
  },
  {
    title: "Workout reminder",
    platforms: [],
    description: "Every day, remind me about the workout I have planned and what's in it.",
  },
  {
    title: "Meditation prompt",
    platforms: [],
    description: "Every morning, suggest a ten-minute guided meditation matched to how I'm feeling.",
  },
  {
    title: "Bedtime wind-down",
    platforms: [],
    description: "Thirty minutes before bed, send a calming routine to help me wind down.",
  },
  {
    title: "Mood check-in",
    platforms: [],
    description: "Twice a day, ask how I'm doing and keep a log of the answers.",
  },
];
