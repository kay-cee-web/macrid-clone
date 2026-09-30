import type { BriefingNeed } from "@/types/briefing";

/**
 * Where an item takes you. `kind` and `ref` are the whole reason the briefing
 * is more than a list of sentences — they are what lets a line about a stalled
 * deal become the deal.
 *
 * Two of them can open the record itself, because those are the only Records
 * pages with a detail route. Everything else lands on its section, which is
 * honest but is not what the feature is for: leads, deals and tasks have no
 * `[id]` page yet, so the three that matter most are the three that can't deep
 * link. Adding those routes is what finishes this.
 */

/** Detail pages that exist, so the item can point at the record. */
const RECORD: Record<string, (ref: string) => string> = {
  list: (ref) => `/records/lists/${ref}`,
  funnel: (ref) => `/records/funnels/${ref}`,
  campaign: (ref) => `/records/campaigns/sms/${ref}`,
};

/** The section an item belongs to, when the record itself has no page. */
const SECTION: Record<string, string> = {
  reply: "/records/leads",
  lead: "/records/leads",
  contact: "/records/leads",
  deal: "/records/deals",
  task: "/records/tasks",
  meeting: "/records/appointments",
  appointment: "/records/appointments",
  company: "/records/companies",
  campaign: "/records/campaigns",
};

/**
 * `watch` is a connector item (Jira, GitHub, Shopify) and deliberately has no
 * link: Plugins lives at `/agents/{id}/plugins`, under whichever agent is open,
 * and the briefing doesn't belong to an agent. Sending the user to an arbitrary
 * agent's Plugins tab would be a guess dressed up as navigation.
 */
export function linkFor(need: BriefingNeed): string {
  const detail = RECORD[need.kind];
  if (detail && need.ref) return detail(need.ref);
  return SECTION[need.kind] ?? "";
}

/** What the link's button says, given where it can actually land. */
export function linkLabelFor(need: BriefingNeed): string {
  if (RECORD[need.kind] && need.ref) return "Open";
  return SECTION[need.kind] ? "View" : "";
}
