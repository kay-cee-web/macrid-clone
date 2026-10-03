import type { Metadata } from "next";
import { FunnelsView } from "@/components/records/FunnelsView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Funnels",
  description: "Your funnels and landing pages, with their public links and status.",
  path: "/records/funnels",
});

export default function RecordFunnelsPage() {
  return <FunnelsView />;
}
