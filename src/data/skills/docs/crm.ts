import type { SkillDoc } from "@/types/skill";

export const CRM_DOCS: Record<string, SkillDoc> = {
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
