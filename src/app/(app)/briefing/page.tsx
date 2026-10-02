import type { Metadata } from "next";
import { BriefingScreen } from "@/components/briefing/BriefingScreen";

export const metadata: Metadata = { title: "Briefing" };

export default function BriefingPage() {
  return <BriefingScreen />;
}
