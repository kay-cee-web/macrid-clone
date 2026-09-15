import type { Metadata } from "next";
import { Suspense } from "react";
import { PluginsView } from "@/components/plugins/PluginsView";

export const metadata: Metadata = { title: "Plugins" };

export default function AgentPluginsPage() {
  return (
    <Suspense>
      <PluginsView />
    </Suspense>
  );
}
