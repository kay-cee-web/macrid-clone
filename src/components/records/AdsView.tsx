"use client";

import { ChartNoAxesCombined, Gauge, TrendingDown, Wallet } from "lucide-react";
import { ConnectorLogo } from "@/components/plugins/ConnectorLogo";
import { WorkspaceConnectorFlows } from "@/components/plugins/ConnectorFlows";
import type { Column } from "@/components/ui/DataTable";
import { Pill } from "@/components/ui/Pill";
import { CONNECTORS_BY_KEY } from "@/data/connectors";
import { AD_GRANTS, AD_PLATFORMS } from "@/data/connectors/social";
import { useAsync } from "@/hooks/useAsync";
import { fetchSocialAccounts } from "@/services/social";
import type { SocialAccount } from "@/types/social";
import { AskAgent, type AgentPrompt } from "./AskAgent";
import { StackCell, TextCell } from "./cells";
import { ConnectorShelf } from "./ConnectorShelf";
import { RecordsSection } from "./RecordsSection";
import { RecordsView } from "./RecordsView";

const PROMPTS: AgentPrompt[] = [
  { label: "How are my ads doing?", hint: "Spend, clicks and results this week", Icon: ChartNoAxesCombined, task: "Read my connected ad accounts and tell me how my ads did this week: spend, clicks, results and cost per result." },
  { label: "Where is money wasted?", hint: "Ads spending without results", Icon: TrendingDown, task: "Look through my ad accounts for ads or campaigns that are spending without results, and tell me which to pause." },
  { label: "Budget check", hint: "Spend against what you planned", Icon: Wallet, task: "Check this month's ad spend across my ad accounts and tell me if I'm on track. Ask me for my budget first." },
  { label: "Watch my ads daily", hint: "A morning summary, every day", Icon: Gauge, task: "Set up a recurring task: every morning at 8am, summarise yesterday's ad spend and results across my ad accounts." },
];

const platformOf = (account: SocialAccount) => AD_PLATFORMS[account.platform];

const columns: Column<SocialAccount>[] = [
  {
    key: "account",
    header: "Ad account",
    cell: (account) => {
      const platform = platformOf(account);
      const via = platform && CONNECTORS_BY_KEY[platform.via];
      return (
        <span className="flex min-w-0 items-center gap-2.5">
          {via && <ConnectorLogo connector={via} className="size-7 rounded-md" />}
          <StackCell primary={account.name || "Unnamed account"} secondary={platform?.name ?? account.platform} />
        </span>
      );
    },
  },
  { key: "currency", header: "Currency", wide: true, cell: (account) => <TextCell value={account.currency} muted /> },
  {
    key: "status",
    header: "Status",
    cell: (account) =>
      account.problem ? <Pill tone="warn" dot>Needs attention</Pill> : <Pill tone="good" dot>Connected</Pill>,
  },
  { key: "problem", header: "Note", wide: true, cell: (account) => <TextCell value={account.problem} muted /> },
];

const matches = (account: SocialAccount, q: string) =>
  [account.name, platformOf(account)?.name ?? account.platform].some((field) => field.toLowerCase().includes(q));

/** Ad accounts read through the social grants, and their numbers read by an agent. */
export function AdsView() {
  const accounts = useAsync(
    () => fetchSocialAccounts("ads").then((rows) => rows.filter((row) => row.kind === "ads")),
    [],
    "Could not read your ad accounts",
  );

  return (
    <WorkspaceConnectorFlows>
      <div className="grid gap-10">
        <RecordsSection title="Ask about performance" description="An agent reads your ad accounts and reports back.">
          <AskAgent label="Ask about your ads" prompts={PROMPTS} />
        </RecordsSection>

        <RecordsSection title="Ad accounts" description="Read-only. Agents report on them; nothing here changes a campaign.">
          <RecordsView
            noun="ad accounts"
            rows={accounts}
            columns={columns}
            rowKey={(account) => account.id}
            matches={matches}
            searchPlaceholder="Search ad accounts"
            empty={{
              icon: <ChartNoAxesCombined />,
              title: "No ad accounts yet",
              description: "They come with the sign-ins below: Meta Ads with Facebook, Google Ads with YouTube.",
            }}
          />
        </RecordsSection>

        <RecordsSection title="Sign-ins that bring ad accounts" description="Connecting one adds its ad accounts above.">
          <ConnectorShelf connectors={AD_GRANTS} />
        </RecordsSection>
      </div>
    </WorkspaceConnectorFlows>
  );
}
