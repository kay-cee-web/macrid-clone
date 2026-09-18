import type { SkillDoc } from "@/types/skill";

export const FUNNELS_DOCS: Record<string, SkillDoc> = {
  "page-from-template": {
    useCases: [
      "A page needed today, not next week",
      "Reusing a layout that already converts",
      "Keeping five pages looking like one brand",
    ],
    steps: [
      "Pick the template and describe the offer.",
      "The agent rewrites every block for what you sell.",
      "Your colours, fonts and proof are put through it.",
      "It hands the page back for review before publishing.",
    ],
    output: "A filled-in page in your brand, waiting on your yes.",
  },
  "lead-magnet": {
    useCases: [
      "Traffic that leaves without giving an address",
      "Needing something worth an email",
      "A download that never actually arrives",
    ],
    steps: [
      "The agent proposes a few magnets that fit what you sell.",
      "It writes the page that asks for the address.",
      "It wires the delivery email and checks the link works.",
      "New signups land in their own list, ready for the sequence.",
    ],
    output: "The magnet, its page, and the email that delivers it.",
  },
  "thank-you-page": {
    useCases: [
      "A page that currently says only \"thanks\"",
      "Booking the call while they are still interested",
      "Telling people what happens next",
    ],
    steps: [
      "The agent writes what happens next and when.",
      "It adds one thing to do while waiting.",
      "Where it fits, it puts the booking link on the page.",
      "It checks the page is what the form actually redirects to.",
    ],
    output: "A thank-you page with the next step on it, and the redirect checked.",
  },
  "funnel-health": {
    useCases: [
      "Funnels published months ago and never revisited",
      "A form that quietly stopped creating leads",
      "Before sending paid traffic anywhere",
    ],
    steps: [
      "The agent walks every published funnel as a visitor would.",
      "It checks links, forms, redirects and the follow-up behind each.",
      "Pages that should have been unpublished are called out.",
      "Findings are ordered by how much traffic each one costs you.",
    ],
    output: "A per-funnel list of what is broken, worst first.",
  },
  "domain-setup": {
    useCases: [
      "A custom domain that half works",
      "Before pointing an ad at a page",
      "Moving a funnel off the temporary address",
    ],
    steps: [
      "Name the funnel and the domain it should answer on.",
      "The agent checks the records, the certificate and the redirects.",
      "Anything wrong is explained in terms of what it breaks.",
      "Fixes come in the order they have to be done.",
    ],
    output: "A checked domain, or an ordered list of what to fix first.",
  },
  "funnel-from-offer": {
    useCases: [
      "Launching an offer with nowhere to send traffic",
      "Testing a second angle on an offer that already works",
      "Replacing a page you built by hand and never finished",
    ],
    steps: [
      "Describe the offer, who it's for and what it costs.",
      "The agent builds the landing page, the thank-you page and the follow-up emails in your own colours and fonts.",
      "The set is handed back unpublished, so you read it before anyone else does.",
      "You publish it when it reads right.",
    ],
    output: "A funnel ready to publish, and its public URL once it is live.",
  },
  "headline-rewrite": {
    useCases: [
      "A page getting traffic but no sign-ups",
      "Reusing a funnel for a different audience",
      "Two angles you can't choose between",
    ],
    steps: [
      "Name the funnel, or paste the page URL.",
      "The agent reads the current headline, sub-head and call to action.",
      "It writes a new version and sets it beside the old one.",
      "Every change comes with the reason it was made.",
    ],
    output: "Old and new copy side by side, with the reasoning, ready to apply.",
  },
  "optin-handoff": {
    useCases: [
      "A form collecting names that nobody follows up",
      "Wiring a new funnel into the CRM",
      "Making sure every sign-up has a task and an owner",
    ],
    steps: [
      "Name the funnel and the list its sign-ups belong in.",
      "Each submission creates a lead and adds it to that list.",
      "The welcome sequence starts on the channel the contact gave you.",
      "A follow-up task is scheduled against the deal.",
    ],
    output: "A funnel whose sign-ups arrive as leads, sequenced, with a task waiting.",
  },
};
