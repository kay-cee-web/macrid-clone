import type { Metadata } from "next";
import { DealsView } from "@/components/records/DealsView";

export const metadata: Metadata = { title: "Deals" };

export default function RecordDealsPage() {
  return <DealsView />;
}
