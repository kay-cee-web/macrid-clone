import type { SkillDoc } from "@/types/skill";

export const WORK_DOCS: Record<string, SkillDoc> = {
  "meeting-notes": {
    useCases: [
      "A page of scribbles nobody will reread",
      "Decisions that were made and then forgotten",
      "Actions that need an owner and a date",
    ],
    steps: [
      "Paste the notes, however rough.",
      "The agent separates decisions from discussion.",
      "Each action gets an owner and a date, and is filed as a task.",
      "Anything left unresolved is listed as an open question.",
    ],
    output: "Decisions, tasks created with owners and dates, and the open questions.",
  },
  "inbox-triage": {
    useCases: [
      "An inbox with more in it than a morning",
      "Replies that matter buried under ones that don't",
      "Deciding what you are not going to answer",
    ],
    steps: [
      "The agent reads the inbox and sorts it three ways.",
      "Anything needing an answer today is drafted for you.",
      "Later ones get a date and a reminder instead of a flag.",
      "It says plainly what it is recommending you ignore.",
    ],
    output: "Three piles, drafts for the urgent one, and reminders for the rest.",
  },
  "delegation-brief": {
    useCases: [
      "Handing work over without a meeting",
      "Work that keeps coming back half done",
      "Someone new doing it for the first time",
    ],
    steps: [
      "Say what the job is and who is doing it.",
      "The agent writes the goal, the constraints and what good looks like.",
      "It states where their judgement ends and yours begins.",
      "It lists what to check before calling it finished.",
    ],
    output: "A brief someone can work from without asking twice.",
  },
  "task-breakdown": {
    useCases: [
      "A piece of work too big to start",
      "Handing a job to someone else without a meeting",
      "Work that keeps stalling on something nobody started",
    ],
    steps: [
      "Describe the work and anything that has to be true before it ships.",
      "The agent splits it into tasks small enough to finish in a sitting.",
      "Tasks are ordered by what blocks what, and the blockers are named.",
      "Each one is filed against a deal with an owner and a date.",
    ],
    output: "A numbered plan, and the tasks created in the CRM with dates.",
  },
  "time-blocking": {
    useCases: [
      "A week with more tasks than hours",
      "Deep work that keeps losing to meetings",
      "Planning around calls that are already booked",
    ],
    steps: [
      "The agent reads the week's tasks and booked appointments.",
      "Long work gets whole blocks; small work is batched into one.",
      "Blocks are laid around the calls that already exist, not over them.",
      "Anything that will not fit is named, rather than quietly dropped.",
    ],
    output: "A day-by-day plan for the week, and what had to be pushed.",
  },
  "daily-report": {
    useCases: [
      "Closing the day without writing the note yourself",
      "Telling someone what moved without a call",
      "Catching what is stuck while it is still cheap to fix",
    ],
    steps: [
      "The agent gathers the day's completed tasks, sends and deal moves.",
      "It separates what finished from what is waiting on somebody.",
      "Anything overdue is called out with how late it is.",
      "It ends with the three things worth starting tomorrow.",
    ],
    output: "A short note: done, moved, stuck, and what is next.",
  },
  "concise-plan": {
    useCases: [
      "A request too vague to act on",
      "Wanting the steps before the work starts",
      "Stopping an agent from guessing at what you meant",
    ],
    steps: [
      "Say what you want, however roughly.",
      "The agent asks about anything genuinely ambiguous — once, up front.",
      "It writes a single plan of small, ordered, doable steps.",
      "Anything outside the plan is listed as explicitly not included.",
    ],
    output: "One plan with atomic steps, and what it deliberately leaves out.",
  },
  "standing-automations": {
    useCases: [
      "Work that should happen whether or not you remember it",
      "Seeing everything already running in one place",
      "Turning off an automation that has outlived its point",
    ],
    steps: [
      "Say what should run and when, in plain words.",
      "The agent schedules it and reads the schedule back to you.",
      "Ask it to list what is running whenever you want the full picture.",
      "Cancelling is a sentence: it names what it cancelled.",
    ],
    output: "The automation scheduled, and the current list of what runs when.",
  },
};
