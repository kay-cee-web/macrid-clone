import type { SkillDoc } from "@/types/skill";

export const CONTENT_DOCS: Record<string, SkillDoc> = {
  "case-study": {
    useCases: [
      "A win nobody outside the company heard about",
      "Proof for a page that currently has none",
      "Something concrete to send a sceptical prospect",
    ],
    steps: [
      "The agent pulls the deal's history: where they started and what changed.",
      "It writes the before, the work and the result.",
      "Every number is marked, so you can check it before it goes out.",
      "It notes what you need permission for.",
    ],
    output: "A case study with its claims marked for checking and sign-off.",
  },
  "social-repurpose": {
    useCases: [
      "One good piece that only ran once",
      "Posting daily without writing daily",
      "Keeping an argument intact across platforms",
    ],
    steps: [
      "Give the long piece and the platforms you post on.",
      "The agent finds the separable ideas inside it.",
      "Each becomes a post written for that platform's length and tone.",
      "They are ordered so the set builds rather than repeats.",
    ],
    output: "A run of posts per platform, ordered, from one source piece.",
  },
  "brand-story": {
    useCases: [
      "An about page that still says nothing",
      "A first email that has to explain who you are",
      "Getting everyone to tell the story the same way",
    ],
    steps: [
      "The agent asks what you sell, who for, and what you were doing before.",
      "It drafts the origin, the founder line and the \"why we exist\" paragraph.",
      "Each one comes in a short and a long version.",
      "Anything it had to assume is listed, so you can correct it.",
    ],
    output: "The story in three lengths, plus the assumptions behind it.",
  },
  "brand-blog": {
    useCases: [
      "A launch that needs a post behind it",
      "Writing for search without sounding like it",
      "A founder essay you keep not writing",
    ],
    steps: [
      "Give the subject, the reader and the point you want made.",
      "The agent outlines it first and waits for a yes.",
      "It writes the piece in your voice, with the headline and subheads.",
      "It closes on a single ask, not a shrug.",
    ],
    output: "A finished article with a headline, structure and closing ask.",
  },
  "web-research": {
    useCases: [
      "A question you would otherwise open twenty tabs for",
      "Checking a claim before you repeat it to a customer",
      "Background before a call with someone you don't know",
    ],
    steps: [
      "The agent breaks the question into the parts worth searching separately.",
      "It reads several sources rather than the first one that agrees.",
      "Where sources disagree, it says so instead of picking quietly.",
      "Every claim keeps the link it came from.",
    ],
    output: "A short report with sources under each claim, and the open questions.",
  },
  "research-synthesis": {
    useCases: [
      "A pile of interview notes nobody has read twice",
      "Survey answers that need to become a decision",
      "Finding the words customers use for what you sell",
    ],
    steps: [
      "Paste or point at the transcripts, replies and survey answers.",
      "The agent groups them into themes and counts how often each came up.",
      "Themes are ranked by weight, not by how strongly they were said.",
      "The clearest quote is kept under each theme.",
    ],
    output: "Ranked themes, each with the quote that makes the case.",
  },
  "course-outline": {
    useCases: [
      "A course you have been meaning to build",
      "Turning what you know into a teachable order",
      "An onboarding series that has to teach, not welcome",
    ],
    steps: [
      "Say who it is for and what they should be able to do afterwards.",
      "The agent orders the material so nothing needs what comes later.",
      "Each session gets an aim, the content, and one exercise.",
      "It marks where people usually give up, and what to put there.",
    ],
    output: "A session-by-session outline with aims, exercises and drop-off points.",
  },
  "thumbnail-prompts": {
    useCases: [
      "Covers for a post that has to run on four platforms",
      "Keeping the look the same across a campaign",
      "Writing prompts you can hand to whatever image tool you use",
    ],
    steps: [
      "Give the subject, the brand colours and the platforms.",
      "The agent writes one prompt per size, the composition described.",
      "Overlay text is written out, short enough to read at thumbnail size.",
      "It keeps a shared style line across all of them, so the set matches.",
    ],
    output: "One image prompt per platform size, with the overlay text.",
  },
};
