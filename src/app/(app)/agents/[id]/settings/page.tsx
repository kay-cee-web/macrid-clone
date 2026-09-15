import type { Metadata } from "next";
import { Suspense } from "react";
import { SettingsView } from "@/components/settings/SettingsView";

export const metadata: Metadata = { title: "Agent settings" };

export default function AgentSettingsPage() {
  return (
    <Suspense>
      <SettingsView />
    </Suspense>
  );
}
