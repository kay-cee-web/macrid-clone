import type { Metadata } from "next";
import { SmsLogsView } from "@/components/records/SmsLogsView";

export const metadata: Metadata = { title: "SMS campaign" };

export default async function RecordSmsCampaignPage({ params }: PageProps<"/records/campaigns/sms/[id]">) {
  const { id } = await params;
  return <SmsLogsView campaignId={id} />;
}
