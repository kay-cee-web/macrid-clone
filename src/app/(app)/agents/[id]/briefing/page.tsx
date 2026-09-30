import type { Metadata } from "next";
import { ForYouView } from "@/components/workspace/ForYouView";

export const metadata: Metadata = { title: "For you" };

export default function AgentBriefingPage() {
  return <ForYouView />;
}
