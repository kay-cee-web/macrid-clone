import type { Idea, IdeaCategory } from "@/types/idea";
import { ANALYTICS } from "./analytics";
import { BUSINESS } from "./business";
import { CRM } from "./crm";
import { DELIVERABILITY } from "./deliverability";
import { FUNNELS } from "./funnels";
import { OUTREACH } from "./outreach";
import { PROSPECTING } from "./prospecting";

/** One category per Macrid product area, in sidebar order; Business is general work. */
export const CATEGORIES: IdeaCategory[] = [
  "Prospecting",
  "Funnels",
  "Outreach",
  "CRM",
  "Deliverability",
  "Analytics",
  "Business",
];

export const IDEAS: Record<IdeaCategory, Idea[]> = {
  Prospecting: PROSPECTING,
  Funnels: FUNNELS,
  Outreach: OUTREACH,
  CRM,
  Deliverability: DELIVERABILITY,
  Analytics: ANALYTICS,
  Business: BUSINESS,
};

export type CategorizedIdea = Idea & { category: IdeaCategory };

/** One idea from each category per pass, so any slice is a cross-section. */
const MIXED: CategorizedIdea[] = (() => {
  const longest = Math.max(...CATEGORIES.map((c) => IDEAS[c].length));
  const out: CategorizedIdea[] = [];
  for (let i = 0; i < longest; i += 1) {
    for (const category of CATEGORIES) {
      const idea = IDEAS[category][i];
      if (idea) out.push({ ...idea, category });
    }
  }
  return out;
})();

const isCategory = (value: string): value is IdeaCategory => (CATEGORIES as string[]).includes(value);

/** Agents have no category column yet, so an unknown category gets the mixed set. */
export function ideasFor(category?: string | null): CategorizedIdea[] {
  if (category && isCategory(category)) return IDEAS[category].map((idea) => ({ ...idea, category }));
  return MIXED;
}

export function readinessOf(idea: Idea) {
  if (idea.ready) return { ready: true, label: "Ready", reason: "Works end to end today" };
  if (idea.blocked) return { ready: false, label: "Needs setup", reason: `Waiting on ${idea.blocked}` };
  return { ready: false, label: "Needs setup", reason: "Not switched on yet" };
}

export const readyCountIn = (category: IdeaCategory) => IDEAS[category].filter((idea) => idea.ready).length;
