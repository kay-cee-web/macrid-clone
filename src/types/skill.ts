import type { PlatformId } from "@/data/platforms";
import type { IdeaCategory } from "@/types/idea";

export type SkillCategory =
  /* The sales work the clone was built around. */
  | "Find prospects"
  | "Build funnels"
  | "Run outreach"
  | "Work the pipeline"
  | "Protect deliverability"
  | "Study performance"
  /* The wider day: the same agent, work that isn't a campaign. */
  | "Get work done"
  | "Write and research"
  | "Grow the business"
  | "Handle money"
  | "Keep on schedule";

/** A named, reusable way of doing a job. Used by typing `/slug` in the chat. */
export type Skill = {
  slug: string;
  category: SkillCategory;
  /** Macrid product area it works in; also picks the row icon (`COVERS`). */
  surface: IdeaCategory;
  description: string;
  name?: string;
  platforms?: PlatformId[];
};

/**
 * The body of a skill's SKILL.md. The overview is the skill's own
 * description, so it is never written twice.
 */
export type SkillDoc = {
  /** When reaching for this skill is the right move. */
  useCases: string[];
  /** What the agent does, in order. */
  steps: string[];
  /** What it hands back when it finishes. */
  output: string;
};
