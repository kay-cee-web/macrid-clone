import type { SkillDoc } from "@/types/skill";

export const CRM_DOCS: Record<string, SkillDoc> = {
  "pipeline-review": {
    useCases: [
      "A Monday review nobody prepares for",
      "Knowing what the month actually closes at",
      "Finding what slipped before someone asks",
    ],
    steps: [
      "The agent lists what sits at each stage, with value and age.",
      "It compares the board against the last review.",
      "Deals that moved backwards or not at all are named.",
      "It gives a realistic close figure, not the optimistic one.",
    ],
    output: "The board by stage, what changed since last week, and a close figure.",
  },
  "book-the-call": {
    useCases: [
      "A warm reply that needs a time, now",
      "Back-and-forth over three emails to find an hour",
      "Meetings booked over other meetings",
    ],
    steps: [
      "The agent checks what is genuinely free in the calendar.",
      "It offers a handful of times in the contact's own hours.",
      "It books the one they pick and holds the slot.",
      "Confirmation goes out, and a reminder is scheduled.",
    ],
    output: "The appointment booked, confirmed and reminded.",
  },
  "task-sweep": {
    useCases: [
      "An overdue list long enough to ignore",
      "Tasks kept open because nobody decided",
      "Clearing the board before a new week",
    ],
    steps: [
      "The agent gathers every task past its date.",
      "Each one gets a decision: do, move, or close.",
      "Moved tasks carry a new date and a reason.",
      "Closed tasks say why, so it is not silent.",
    ],
    output: "An empty overdue list, and a note of what was moved or closed.",
  },
  "lost-reasons": {
    useCases: [
      "Losing deals for reasons nobody wrote down",
      "Deciding whether it is price or timing",
      "Fixing the thing that keeps costing you",
    ],
    steps: [
      "The agent reads the deals closed lost over a period.",
      "It groups them by why they went.",
      "Each group is weighed by the money it represents.",
      "It separates what you could have changed from what you could not.",
    ],
    output: "Loss reasons grouped and valued, split into fixable and not.",
  },
  "contact-handover": {
    useCases: [
      "Passing an account to someone else",
      "Coming back to a contact after months",
      "Cover while you are away",
    ],
    steps: [
      "The agent gathers the history: messages, calls, deals, tasks.",
      "It writes what was promised and by when.",
      "It states where things stand and what is next.",
      "Anything unresolved is listed separately, not buried.",
    ],
    output: "One note someone can read cold and pick the contact up from.",
  },
  "stale-deals": {
    useCases: [
      "A pipeline nobody has touched in a fortnight",
      "Weekly pipeline hygiene",
      "Deciding what to work on first on Monday",
    ],
    steps: [
      "The agent lists every deal with no movement in two weeks.",
      "For each one it says what the next step should be, and why.",
      "Tasks are created with an owner and a due date.",
      "Deals worth giving up on are named rather than deleted.",
    ],
    output: "A task per stale deal, and a short list of ones to close out.",
  },
  "reply-to-deal": {
    useCases: [
      "A warm reply sitting in the inbox",
      "Stopping a sequence the moment someone answers",
      "Getting a deal onto the board at the right stage",
    ],
    steps: [
      "Point the agent at the reply.",
      "It creates the deal at the stage the reply implies, with the value it mentions.",
      "That contact is pulled out of every running sequence.",
      "The first follow-up task is scheduled.",
    ],
    output: "A deal on the board, the contact out of every sequence, and a task set.",
  },
  "call-brief": {
    useCases: [
      "The ten minutes before a call",
      "Taking over someone else's account",
      "Prep for a renewal conversation",
    ],
    steps: [
      "Name the contact, or the appointment it belongs to.",
      "The agent summarises everything you have sent them.",
      "It adds what they have opened or clicked since.",
      "It ends with the three things worth asking.",
    ],
    output: "A one-screen brief: history, engagement, and three questions.",
  },
};
