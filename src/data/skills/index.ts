import type { Skill, SkillCategory } from "@/types/skill";
import { SKILLS } from "./catalog";
import { SKILL_DOCS } from "./docs";
import { GENERAL_SKILLS } from "./general";

export type { Skill, SkillCategory, SkillDoc } from "@/types/skill";

/** Filter order: the sales work first, then the rest of the day. */
export const SKILL_CATEGORIES: SkillCategory[] = [
  "Find prospects",
  "Build funnels",
  "Run outreach",
  "Work the pipeline",
  "Protect deliverability",
  "Study performance",
  "Get work done",
  "Write and research",
  "Grow the business",
  "Handle money",
  "Keep on schedule",
];

export const FEATURED_SKILLS: Skill[] = [
  {
    slug: "lead-sweep", name: "Lead Sweep", category: "Find prospects", surface: "Lead sourcing",
    platforms: ["google_maps", "linkedin"],
    description: "Your standing search. Sweeps a niche and an area, scores every business on how reachable and ready to buy it looks, drops dead listings, and hands back a list you can send to.",
  },
  {
    slug: "follow-up-run", name: "Follow-Up Run", category: "Run outreach", surface: "Message sending",
    platforms: ["email", "whatsapp", "sms"],
    description: "Turns one list into a whole sequence: the first message and two follow-ups, each on the channel that contact actually has, pulling anyone who replies out of the run.",
  },
  {
    slug: "inbox-check", name: "Inbox Check", category: "Protect deliverability", surface: "Deliverability",
    platforms: ["email"],
    description: "Runs before anything sends. Verifies the list, holds back invalid and risky addresses, re-checks SPF, DKIM and DMARC, and tells you what to fix first.",
  },
];

export { SKILLS, GENERAL_SKILLS, SKILL_DOCS };

/** The whole catalogue, featured first, as the skills hub lists it. */
export const ALL_SKILLS: Skill[] = [...FEATURED_SKILLS, ...SKILLS, ...GENERAL_SKILLS];

export const isFeatured = (slug: string) => FEATURED_SKILLS.some((skill) => skill.slug === slug);

export const docFor = (slug: string) => SKILL_DOCS[slug] ?? null;

/** Display name: the given one, else the slug turned back into words. */
export const skillName = (skill: Skill) =>
  skill.name ?? skill.slug.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");

export const skillPrompt = (slug: string) => `/${slug} `;
export const CREATE_SKILL_PROMPT = "Create a new skill for me. It should ";
