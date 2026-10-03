import type { Metadata } from "next";
import { AnalyticsView } from "@/components/records/AnalyticsView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Analytics",
  description: "Email, SMS and WhatsApp campaign performance over the last 7, 30 or 90 days.",
  path: "/records/analytics",
});

export default function RecordAnalyticsPage() {
  return <AnalyticsView />;
}
