import { CATEGORIES } from "@/data/ideas";
import type { Agent } from "@/types/agent";
import type { IdeaCategory } from "@/types/idea";

/**
 * Agents have no category column yet, so one is inferred from the name and
 * brief. Specific words weigh more than broad ones ("bounce" beats "email").
 */
/** Reminders is never inferred: "every Monday" appears in half the marketing work too. */
const SIGNALS: Record<Exclude<IdeaCategory, "Reminders">, [RegExp, number][]> = {
  "Lead sourcing": [[/prospect|lead gen|find (?:leads|businesses|\d+)|google maps|places|linkedin|scrape|directory/g, 2], [/\bleads?\b/g, 1]],
  "Page building": [[/funnel|landing page|opt-?in|squeeze page/g, 2], [/\bpages?\b|website/g, 1]],
  "Message sending": [[/outreach|campaign|cold (?:email|message)|follow[- ]?ups?|newsletter|whatsapp|\bsms\b/g, 2], [/e-?mail|message|send/g, 1]],
  "Pipeline handling": [[/\bcrm\b|pipeline|\bdeals?\b|appointment|book(?:ing)? (?:a )?(?:call|meeting)/g, 2], [/tasks?|calendar|meeting|contacts?/g, 1]],
  Deliverability: [[/deliverab|bounce|spam|inbox placement|verify (?:e-?mails?|addresses)|sending domain|dmarc|spf|dkim/g, 3]],
  Analytics: [[/analytics|report|metrics|\bkpis?\b|open rate|click rate|dashboard/g, 2], [/performance|stats/g, 1]],
  Creative: [[/\bseo\b|blog|caption|social post|brand voice|copywrit|repurpos|newsletter copy/g, 2], [/content|draft|write/g, 1]],
  "Social media": [[/social media|linkedin post|instagram|tiktok|\btweets?\b|x thread|hashtags?|\breels?\b|telegram channel|cross-?post|publish (?:the |my )?posts?/g, 3]],
  Research: [[/research|compare|pricing|market|\bicp\b|sources?|find out/g, 2]],
  "Work productivity": [[/briefing|wrap-?up|triage|stand-?up|my (?:day|inbox|calendar)|to-?do/g, 2], [/\bdigest\b|reminder/g, 1]],
  "Business growth": [[/churn|retention|upsell|competitor|reviews?|feedback|referral|win-?back/g, 2]],
  "Money handling": [[/invoice|expense|budget|payment|subscription|billing|receipts?|balance|revenue/g, 2]],
  Corporate: [[/team update|minutes|handover|onboarding|policy|internal|quarterly review|supplier|process/g, 2]],
  Education: [[/stud(?:y|ying)|flashcard|quiz|vocabulary|revision|curriculum|learn(?:ing)?|teach/g, 2]],
};

const isCategory = (value: string): value is IdeaCategory => (CATEGORIES as string[]).includes(value);

export function categoryOf(agent: Pick<Agent, "name" | "instructions" | "category">): IdeaCategory {
  if (isCategory(agent.category)) return agent.category;
  const text = `${agent.name} ${agent.instructions}`.toLowerCase();

  let best: IdeaCategory = "Work productivity";
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
