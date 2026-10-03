import type { Metadata } from "next";
import { WorkflowsCatalog } from "@/components/workbench/WorkflowsCatalog";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Workflows",
  description: "Ready-made workflows an agent can start on right away, grouped by the kind of work.",
  path: "/agents/workbench",
});

export default function WorkbenchPage() {
  return <WorkflowsCatalog />;
}
