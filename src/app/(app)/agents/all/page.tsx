import type { Metadata } from "next";
import { AgentsCatalog } from "@/components/agents/AgentsCatalog";

export const metadata: Metadata = { title: "Agent hub" };

export default function AllAgentsPage() {
  console.log("ok");
  return <AgentsCatalog />;
}
