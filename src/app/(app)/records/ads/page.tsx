import type { Metadata } from "next";
import { AdsView } from "@/components/records/AdsView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Ads monitoring",
  description: "Your ad accounts, and how your ads are doing.",
  path: "/records/ads",
});

export default function RecordAdsPage() {
  return <AdsView />;
}
