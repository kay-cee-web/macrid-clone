import type { Metadata } from "next";
import { AgentsCatalog } from "@/components/agents/AgentsCatalog";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Agent hub",
  description: "Every agent in your workspace: search, sort, favourite, rename, clone or delete them.",
  path: "/agents/all",
});

export default function AllAgentsPage() {
  return <AgentsCatalog />;
}
