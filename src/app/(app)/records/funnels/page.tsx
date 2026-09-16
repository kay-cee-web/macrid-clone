import type { Metadata } from "next";
import { FunnelsView } from "@/components/records/FunnelsView";

export const metadata: Metadata = { title: "Funnels" };

export default function RecordFunnelsPage() {
  return <FunnelsView />;
}
