import type { PlatformId } from "@/data/platforms";
import { SKILLS } from "./catalog";

/** A named, reusable way of doing a job. Used by typing `/slug` in the chat. */
export type Skill = {
  slug: string;
  category: SkillCategory;
  /** Macrid product area it works in. */
  surface: string;
  description: string;
  name?: string;
  platforms?: PlatformId[];
};

export type SkillCategory =
  | "Find prospects"
  | "Build funnels"
  | "Run outreach"
  | "Work the pipeline"
  | "Protect deliverability"
  | "Study performance";

export const SKILL_CATEGORIES: SkillCategory[] = [
  "Find prospects",
  "Build funnels",
  "Run outreach",
  "Work the pipeline",
  "Protect deliverability",
  "Study performance",
];

export const FEATURED_SKILLS: Skill[] = [
  {
    slug: "lead-sweep", name: "Lead Sweep", category: "Find prospects", surface: "Prospecting",
    platforms: ["google_maps", "linkedin"],
    description: "Your standing search. Sweeps a niche and an area, scores every business on how reachable and ready to buy it looks, drops dead listings, and hands back a list you can send to.",
  },
  {
    slug: "follow-up-run", name: "Follow-Up Run", category: "Run outreach", surface: "Outreach",
    platforms: ["email", "whatsapp", "sms"],
    description: "Turns one list into a whole sequence: the first message and two follow-ups, each on the channel that contact actually has, pulling anyone who replies out of the run.",
  },
  {
    slug: "inbox-check", name: "Inbox Check", category: "Protect deliverability", surface: "Deliverability",
    platforms: ["email"],
    description: "Runs before anything sends. Verifies the list, holds back invalid and risky addresses, re-checks SPF, DKIM and DMARC, and tells you what to fix first.",
  },
];

export { SKILLS };

export const skillPrompt = (slug: string) => `/${slug} `;
export const CREATE_SKILL_PROMPT = "Create a new skill for me. It should ";
