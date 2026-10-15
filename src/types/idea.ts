import type { PlatformId } from "@/data/platforms";

/**
 * Categories are the user-facing headings, not the Macrid area names: the first
 * three cover Prospect Finder, Funnels and Outreach in that order. CRM work has
 * no heading of its own: it sits with Lead sourcing, Message sending, Work
 * productivity and Business growth.
 */
export type IdeaCategory =
  | "Lead sourcing"
  | "Page building"
  | "Message sending"
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
