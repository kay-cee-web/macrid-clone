import type { Metadata } from "next";
import { ModelsCatalog } from "@/components/models/ModelsCatalog";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Models",
  description: "The AI models your agents can run on, and where to add your own provider keys.",
  path: "/agents/workbench/models",
});

export default function WorkbenchPage() {
  return <ModelsCatalog />;
}
