import { missingIn, platformNames, type WorkspaceSetup } from "@/lib/setup/platforms";
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

export type Readiness = { ready: boolean; tone: "good" | "warn" | "neutral"; label: string; reason: string };

/**
 * Two layers: `ready`/`blocked` say whether the agent's tools can do the whole
 * task; `setup` (the workspace's real connections, null while unknown) says
 * whether the platforms it needs are connected.
 */
export function readinessOf(idea: Idea, setup: WorkspaceSetup | null = null): Readiness {
  if (idea.blocked) return { ready: false, tone: "neutral", label: "Not available", reason: `Waiting on ${idea.blocked}` };
  if (!idea.ready) return { ready: false, tone: "neutral", label: "Partly", reason: "The agent can't do every step of this yet" };
  const missing = missingIn(setup, idea.platforms);
  if (missing.length) {
    return { ready: false, tone: "warn", label: `Connect ${platformNames(missing)}`, reason: setup?.[missing[0]].note ?? "" };
  }
  return { ready: true, tone: "good", label: "Ready", reason: "Works end to end today" };
}

export const readyCountIn = (category: IdeaCategory) => IDEAS[category].filter((idea) => idea.ready).length;
