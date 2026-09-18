import type { Metadata } from "next";
import { ModelsCatalog } from "@/components/models/ModelsCatalog";

export const metadata: Metadata = { title: "Models" };

export default function WorkbenchPage() {
  return <ModelsCatalog />;
}
