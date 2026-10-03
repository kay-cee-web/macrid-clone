import type { Metadata } from "next";
import { DealsView } from "@/components/records/DealsView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Deals",
  description: "Deals in your pipeline, with stage, value and close date.",
  path: "/records/deals",
});

export default function RecordDealsPage() {
  return <DealsView />;
}
