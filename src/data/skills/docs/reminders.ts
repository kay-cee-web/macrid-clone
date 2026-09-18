import type { SkillDoc } from "@/types/skill";

export const REMINDERS_DOCS: Record<string, SkillDoc> = {
  "follow-up-nudge": {
    useCases: [
      "Waiting on someone who has gone quiet",
      "A thing to check back on next month",
      "Remembering why you set the reminder at all",
    ],
    steps: [
      "Say what to come back to, and when.",
      "The agent keeps the context: who, what, what you were waiting on.",
      "It raises it on the day with all of that attached.",
      "If the thing resolved itself meanwhile, it says so instead.",
    ],
    output: "A reminder that arrives with its own context, not just a title.",
  },
  "client-dates": {
    useCases: [
      "The anniversary of a signing, noticed a week late",
      "Renewals that arrive without a conversation first",
      "Remembering what someone told you about themselves",
    ],
    steps: [
      "The agent collects the dates that matter per contact.",
      "Each gets a lead time — a week out, a month out.",
      "It drafts the note to send when the date comes near.",
      "Nothing sends on its own; it arrives for you to approve.",
    ],
    output: "A calendar of client dates, each with a draft note ready early.",
  },
  "deadline-countdown": {
    useCases: [
      "A fixed date with a lot in front of it",
      "Work that always compresses into the last week",
      "Knowing today whether you are behind",
    ],
    steps: [
      "Give the date and what has to be true by then.",
      "The agent works backwards into milestones.",
      "Each milestone is scheduled, not just listed.",
      "It tells you when a milestone slips, not at the end.",
    ],
    output: "Milestones counted back from the date, scheduled and watched.",
  },
  "wellness-check": {
    useCases: [
      "Days that start early and never stop",
      "Breaks that get skipped when it is busy",
      "A proper end to the working day",
    ],
    steps: [
      "Say what you want held: the break, the walk, the finish time.",
      "The agent nudges at the right hours, not constantly.",
      "On days that are clearly buried, it stays quiet.",
      "It notices when the same thing gets skipped all week.",
    ],
    output: "Quiet nudges at the right hours, and a note when one keeps slipping.",
  },
  "weekly-reset": {
    useCases: [
      "Fridays that just stop rather than close",
      "Mondays spent working out where you were",
      "Work that carries over forever without being decided",
    ],
    steps: [
      "On Friday the agent lists what got done and what did not.",
      "Anything carrying over has to be moved, dropped or done.",
      "It writes what Monday starts with.",
      "On Monday it opens with that, not with the inbox.",
    ],
    output: "A Friday close-down summary and a Monday first task.",
  },
  "standing-reminder": {
    useCases: [
      "A routine you keep meaning to keep",
      "Month-end work that is always remembered on the 3rd",
      "A check that matters more than it is urgent",
    ],
    steps: [
      "Say what should happen and how often, in your own words.",
      "The agent turns it into a schedule and reads it back.",
      "It raises the reminder at the time, with the context attached.",
      "Skipped once is fine; skipped three times and it asks whether to stop.",
    ],
    output: "The routine scheduled, and a nudge at the time it is due.",
  },
  "study-plan": {
    useCases: [
      "An exam far enough away to keep putting off",
      "Subjects you avoid because they are the hard ones",
      "Study that has to fit around a working day",
    ],
    steps: [
      "Give the exam date, the subjects, and where you are weakest.",
      "The agent weights the plan towards the weak subjects, not the comfortable ones.",
      "Sessions are sized to the hours you actually have on each day.",
      "A review pass is scheduled before the date, not the night before.",
    ],
    output: "A week-by-week plan with daily sessions and a revision pass.",
  },
  "home-routine": {
    useCases: [
      "The personal run of things, kept beside the work one",
      "Bills and appointments remembered at midnight",
      "Repeats that never make it onto a work calendar",
    ],
    steps: [
      "List the repeating things: bills, appointments, renewals, the weekly shop.",
      "The agent puts them on a schedule with the right lead time.",
      "It raises each one early enough to actually do something about it.",
      "Anything that slipped is carried forward rather than dropped.",
    ],
    output: "The personal routine on a schedule, with early warnings.",
  },
};
