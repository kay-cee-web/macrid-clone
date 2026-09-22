import type { Idea } from "@/types/idea";

/**
 * Learning something, whether it's a language or the product you sell. The
 * scheduled ones run through `schedule_automation` and reach you on a paired
 * channel, so none is marked ready until a channel exists.
 */
export const EDUCATION: Idea[] = [
  {
    title: "Study session reminder",
    platforms: ["calendar"],
    description: "Every weekday, block focus time on my calendar and remind me ten minutes before it starts.",
  },
  {
    title: "Flashcard prompt",
    platforms: [],
    description: "Every weekday morning, send three flashcard questions from my active deck.",
  },
  {
    title: "Vocabulary of the day",
    platforms: [],
    description: "Every weekday at 9am, send a new word with example sentences and how to say it.",
  },
  {
    title: "Reading list digest",
    platforms: [],
    description: "Every Saturday, summarise the articles I saved this week and pick the three worth reading.",
  },
  {
    title: "Note summary",
    platforms: [],
    description: "After each study session, turn my notes into a short review sheet.",
  },
  {
    title: "Weekly review quiz",
    platforms: [],
    description: "Every Sunday, build a short quiz covering what I studied that week.",
  },
  {
    title: "Explain it at my level",
    ready: true,
    platforms: [],
    description: "When I paste something I don't follow, explain it as simply as I ask for, with one example I'd recognise.",
  },
  {
    title: "Learning plan",
    ready: true,
    platforms: [],
    description: "When I name a subject and how long I have, lay out what to cover each week and what to skip.",
  },
  {
    title: "Teach me the product",
    ready: true,
    platforms: [],
    description: "Quiz me on what we sell, using my own pages and past replies as the source.",
  },
  {
    title: "Lesson plan",
    ready: true,
    platforms: [],
    description: "When I give a subject, a level and the time I have, lay out the session: what it covers, in what order, and the exercise that proves it landed.",
  },
  {
    title: "Quiz from any material",
    ready: true,
    platforms: [],
    description: "Turn a topic or something I paste into a quiz with mixed question types, at the difficulty I ask for.",
  },
  {
    title: "Progress check",
    ready: true,
    platforms: [],
    description: "From what I've finished and how I scored, tell me where I'm strong, where the gaps are, and what next week should cover.",
  },
];
