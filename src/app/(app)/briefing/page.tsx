import type { Metadata } from "next";
import { BriefingScreen } from "@/components/briefing/BriefingScreen";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Briefing",
  description: "What needs you today, gathered from your records, with the agent that will act on it.",
  path: "/briefing",
});

export default function BriefingPage() {
  return <BriefingScreen />;
}
