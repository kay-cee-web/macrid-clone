import type { Metadata } from "next";
import { ModelsCatalog } from "@/components/models/ModelsCatalog";

export const metadata: Metadata = { title: "Models" };

export default function ModelsPage() {
  return <ModelsCatalog />;
}
