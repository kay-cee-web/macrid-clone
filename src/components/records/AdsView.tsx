"use client";

import { ChartNoAxesCombined, Gauge, TrendingDown, Wallet } from "lucide-react";
import { WorkspaceConnectorFlows } from "@/components/plugins/ConnectorFlows";
import { AD_GRANTS } from "@/data/connectors/social";
import { AdsPerformance } from "./AdsPerformance";
import { AskAgent, type AgentPrompt } from "./AskAgent";
import { ConnectorShelf } from "./ConnectorShelf";
import { RecordsSection } from "./RecordsSection";

const PROMPTS: AgentPrompt[] = [
  { label: "How are my ads doing?", hint: "Spend, clicks and results this week", Icon: ChartNoAxesCombined, task: "Read my connected ad accounts and tell me how my ads did this week: spend, clicks, results and cost per result." },
  { label: "Where is money wasted?", hint: "Ads spending without results", Icon: TrendingDown, task: "Look through my ad accounts for ads or campaigns that are spending without results, and tell me which to pause." },
  { label: "Budget check", hint: "Spend against what you planned", Icon: Wallet, task: "Check this month's ad spend across my ad accounts and tell me if I'm on track. Ask me for my budget first." },
  { label: "Watch my ads daily", hint: "A morning summary, every day", Icon: Gauge, task: "Set up a recurring task: every morning at 8am, summarise yesterday's ad spend and results across my ad accounts." },
];

/** Ad accounts and their figures (`/ads/overview`), the sign-ins that bring them, and an agent for the reading. */
export function AdsView() {
  return (
    <WorkspaceConnectorFlows>
      <div className="grid gap-10">
        <AdsPerformance />

        <RecordsSection title="Ask about your ads" description="An agent reads the same accounts and tells you what to change.">
          <AskAgent label="Ask about your ads" prompts={PROMPTS} />
        </RecordsSection>

        <RecordsSection title="Sign-ins that bring ad accounts" description="Read-only. Connecting one adds its ad accounts above.">
          <ConnectorShelf connectors={AD_GRANTS} />
        </RecordsSection>
      </div>
    </WorkspaceConnectorFlows>
  );
}
