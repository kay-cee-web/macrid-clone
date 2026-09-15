import type { Metadata } from "next";
import { WorkflowsView } from "@/components/workspace/WorkflowsView";

export const metadata: Metadata = { title: "Workflows" };

export default function AgentWorkflowsPage() {
  return <WorkflowsView />;
}
