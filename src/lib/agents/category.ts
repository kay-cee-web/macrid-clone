import { CATEGORIES } from "@/data/ideas";
import type { Agent } from "@/types/agent";
import type { IdeaCategory } from "@/types/idea";

/**
 * Agents have no category column yet, so one is inferred from the name and
 * brief. Specific words weigh more than broad ones ("bounce" beats "email").
 */
const SIGNALS: Record<Exclude<IdeaCategory, "Business">, [RegExp, number][]> = {
  Prospecting: [[/prospect|lead gen|find (?:leads|businesses|\d+)|google maps|places|linkedin|scrape|directory/g, 2], [/\bleads?\b/g, 1]],
  Funnels: [[/funnel|landing page|opt-?in|squeeze page/g, 2], [/\bpages?\b|website/g, 1]],
  Outreach: [[/outreach|campaign|cold (?:email|message)|follow[- ]?ups?|newsletter|whatsapp|\bsms\b/g, 2], [/e-?mail|message|send/g, 1]],
  CRM: [[/\bcrm\b|pipeline|\bdeals?\b|appointment|book(?:ing)? (?:a )?(?:call|meeting)/g, 2], [/tasks?|calendar|meeting|contacts?/g, 1]],
  Deliverability: [[/deliverab|bounce|spam|inbox placement|verify (?:e-?mails?|addresses)|sending domain|dmarc|spf|dkim/g, 3]],
  Analytics: [[/analytics|report|metrics|\bkpis?\b|open rate|click rate|dashboard/g, 2], [/performance|stats/g, 1]],
};

const isCategory = (value: string): value is IdeaCategory => (CATEGORIES as string[]).includes(value);

export function categoryOf(agent: Pick<Agent, "name" | "instructions" | "category">): IdeaCategory {
  if (isCategory(agent.category)) return agent.category;
  const text = `${agent.name} ${agent.instructions}`.toLowerCase();

  let best: IdeaCategory = "Business";
  let bestScore = 0;
  for (const [category, signals] of Object.entries(SIGNALS) as [IdeaCategory, [RegExp, number][]][]) {
    const score = signals.reduce((sum, [pattern, weight]) => sum + (text.match(pattern)?.length ?? 0) * weight, 0);
    if (score > bestScore) {
      best = category;
      bestScore = score;
    }
  }
  return best;
}
