import type { Metadata } from "next";
import { LeadsView } from "@/components/records/LeadsView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Leads",
  description: "Every lead in your workspace, with its list and status.",
  path: "/records/leads",
});

export default function RecordLeadsPage() {
  return <LeadsView />;
}
