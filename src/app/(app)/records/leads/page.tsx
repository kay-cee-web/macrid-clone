import type { Metadata } from "next";
import { LeadsView } from "@/components/records/LeadsView";

export const metadata: Metadata = { title: "Leads" };

export default function RecordLeadsPage() {
  return <LeadsView />;
}
