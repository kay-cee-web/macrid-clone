import type { PlatformId } from "@/data/platforms";

export type IdeaCategory =
  | "Prospecting"
  | "Funnels"
  | "Outreach"
  | "CRM"
  | "Deliverability"
  | "Analytics"
  | "Business";

/** A standing task an agent could be given. The description opens with when it runs. */
export type Idea = {
  title: string;
  description: string;
  platforms: PlatformId[];
  /** Works end to end today. Absent means "needs setup", the cautious default. */
  ready?: boolean;
  /** Names something that has to be bought or built first. */
  blocked?: string;
};
