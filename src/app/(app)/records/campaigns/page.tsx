import type { Metadata } from "next";
import { CampaignsView } from "@/components/records/CampaignsView";
import { pageMetadata } from "@/lib/seo/site";
import { Suspense } from "react";

export const metadata: Metadata = pageMetadata({
  title: "Campaigns",
  description: "Email, SMS and WhatsApp campaigns in your workspace, with their results.",
  path: "/records/campaigns",
});

export default function RecordCampaignsPage() {
  return (
    <Suspense>
      <CampaignsView />
    </Suspense>
  );
}
