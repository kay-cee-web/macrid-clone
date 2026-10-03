import type { Metadata } from "next";
import { SmsLogsView } from "@/components/records/SmsLogsView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "SMS campaign",
  description: "The delivery log for one SMS campaign: who it reached, what failed and what it cost.",
});

export default async function RecordSmsCampaignPage({ params }: PageProps<"/records/campaigns/sms/[id]">) {
  const { id } = await params;
  return <SmsLogsView campaignId={id} />;
}
