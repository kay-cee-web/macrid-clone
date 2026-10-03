import type { Metadata } from "next";
import { FunnelDetailView } from "@/components/records/FunnelDetailView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Funnel",
  description: "Views, clicks and visitors for one funnel, with its latest events.",
});

export default async function RecordFunnelPage({ params }: PageProps<"/records/funnels/[slug]">) {
  const { slug } = await params;
  return <FunnelDetailView slug={decodeURIComponent(slug)} />;
}
