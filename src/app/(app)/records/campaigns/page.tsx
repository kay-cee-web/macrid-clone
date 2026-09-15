import type { Metadata } from "next";
import { Suspense } from "react";
import { CampaignsView } from "@/components/records/CampaignsView";

export const metadata: Metadata = { title: "Campaigns" };

export default function RecordCampaignsPage() {
  return (
    <Suspense>
      <CampaignsView />
    </Suspense>
  );
}
