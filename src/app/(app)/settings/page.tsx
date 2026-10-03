import type { Metadata } from "next";
import { AccountSettings } from "@/components/app/AccountSettings";
import { pageMetadata } from "@/lib/seo/site";
import { Suspense } from "react";

export const metadata: Metadata = pageMetadata({
  title: "Settings",
  description: "Your workspace, members, plan and billing, API keys, profile and appearance.",
  path: "/settings",
});

export default function SettingsPage() {
  return (
    <Suspense>
      <AccountSettings />
    </Suspense>
  );
}
