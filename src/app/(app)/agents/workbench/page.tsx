import type { Metadata } from "next";
import { WorkflowsCatalog } from "@/components/workbench/WorkflowsCatalog";

export const metadata: Metadata = { title: "Workflows" };

export default function WorkbenchPage() {
  return <WorkflowsCatalog />;
}
