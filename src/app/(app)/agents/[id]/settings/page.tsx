import type { Metadata } from "next";
import { SettingsView } from "@/components/settings/SettingsView";
import { pageMetadata } from "@/lib/seo/site";
import { Suspense } from "react";

export const metadata: Metadata = pageMetadata({
  title: "Agent settings",
  description: "Sending, approval, model, chat channels and usage for this agent.",
});

export default function AgentSettingsPage() {
  return (
    <Suspense>
      <SettingsView />
    </Suspense>
  );
}
