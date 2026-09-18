import type { SkillDoc } from "@/types/skill";
import { ANALYTICS_DOCS } from "./analytics";
import { CONTENT_DOCS } from "./content";
import { CRM_DOCS } from "./crm";
import { DELIVERABILITY_DOCS } from "./deliverability";
import { FEATURED_DOCS } from "./featured";
import { FUNNELS_DOCS } from "./funnels";
import { GROWTH_DOCS } from "./growth";
import { MONEY_DOCS } from "./money";
import { OUTREACH_DOCS } from "./outreach";
import { PROSPECTING_DOCS } from "./prospecting";
import { REMINDERS_DOCS } from "./reminders";
import { WORK_DOCS } from "./work";

/** Every skill's SKILL.md body, keyed by slug. One file per surface. */
export const SKILL_DOCS: Record<string, SkillDoc> = {
  ...FEATURED_DOCS,
  ...PROSPECTING_DOCS,
  ...FUNNELS_DOCS,
  ...OUTREACH_DOCS,
  ...CRM_DOCS,
  ...DELIVERABILITY_DOCS,
  ...ANALYTICS_DOCS,
  ...WORK_DOCS,
  ...CONTENT_DOCS,
  ...GROWTH_DOCS,
  ...MONEY_DOCS,
  ...REMINDERS_DOCS,
};
