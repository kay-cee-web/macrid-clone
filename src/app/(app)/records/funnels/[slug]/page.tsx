import type { Metadata } from "next";
import { FunnelDetailView } from "@/components/records/FunnelDetailView";

export const metadata: Metadata = { title: "Funnel" };

export default async function RecordFunnelPage({ params }: PageProps<"/records/funnels/[slug]">) {
  const { slug } = await params;
  return <FunnelDetailView slug={decodeURIComponent(slug)} />;
}
