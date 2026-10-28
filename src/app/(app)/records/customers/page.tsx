import type { Metadata } from "next";
import { LeadsView } from "@/components/records/LeadsView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Customers",
  description: "Every customer in your workspace, with its list and status.",
  path: "/records/customers",
});

export default function RecordCustomersPage() {
  return <LeadsView />;
}
