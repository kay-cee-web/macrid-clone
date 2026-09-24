import type { PlatformId } from "@/data/platforms";

/**
 * Categories are the user-facing headings, not the Macrid area names: the first
 * four cover Prospect Finder, Funnels, Outreach and CRM in that order.
 */
export type IdeaCategory =
  | "Lead sourcing"
  | "Page building"
  | "Message sending"
  | "Pipeline handling"
  | "Deliverability"
  | "Analytics"
  | "Creative"
  /** Writing and publishing posts on social networks. */
  | "Social media"
  | "Research"
  | "Work productivity"
  | "Business growth"
  | "Money handling"
  | "Corporate"
  | "Education"
  /** Standing reminders and personal routines the agent runs on a schedule. */
  | "Reminders";

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
