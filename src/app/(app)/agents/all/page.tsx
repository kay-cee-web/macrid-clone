import type { Metadata } from "next";
import { AgentsCatalog } from "@/components/agents/AgentsCatalog";

export const metadata: Metadata = { title: "All agents" };

export default function AllAgentsPage() {
  return <AgentsCatalog />;
}
