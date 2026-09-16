import type { Metadata } from "next";
import { AnalyticsView } from "@/components/records/AnalyticsView";

export const metadata: Metadata = { title: "Analytics" };

export default function RecordAnalyticsPage() {
  return <AnalyticsView />;
}
