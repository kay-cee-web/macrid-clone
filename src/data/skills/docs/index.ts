import type { SkillDoc } from "@/types/skill";
import { ANALYTICS_DOCS } from "./analytics";
import { CRM_DOCS } from "./crm";
import { DELIVERABILITY_DOCS } from "./deliverability";
import { FEATURED_DOCS } from "./featured";
import { FUNNELS_DOCS } from "./funnels";
import { OUTREACH_DOCS } from "./outreach";
import { PROSPECTING_DOCS } from "./prospecting";

/** Every skill's SKILL.md body, keyed by slug. One file per surface. */
export const SKILL_DOCS: Record<string, SkillDoc> = {
  ...FEATURED_DOCS,
  ...PROSPECTING_DOCS,
  ...FUNNELS_DOCS,
  ...OUTREACH_DOCS,
  ...CRM_DOCS,
  ...DELIVERABILITY_DOCS,
  ...ANALYTICS_DOCS,
};
