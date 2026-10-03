import type { Metadata } from "next";
import { WorkflowsView } from "@/components/workspace/WorkflowsView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Workflows",
  description: "Standing tasks this agent can run, ready to send to its chat.",
});

export default function AgentWorkflowsPage() {
  return <WorkflowsView />;
}
