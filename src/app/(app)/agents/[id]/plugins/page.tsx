import type { Metadata } from "next";
import { PluginsView } from "@/components/plugins/PluginsView";
import { pageMetadata } from "@/lib/seo/site";
import { Suspense } from "react";

export const metadata: Metadata = pageMetadata({
  title: "Plugins",
  description: "Connect the tools and accounts this agent works with, and add skills to its chat.",
});

export default function AgentPluginsPage() {
  return (
    <Suspense>
      <PluginsView />
    </Suspense>
  );
}
