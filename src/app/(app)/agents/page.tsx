import type { Metadata } from "next";
import { Suspense } from "react";
import { AgentsHome } from "@/components/agents/AgentsHome";

export const metadata: Metadata = { title: "Agents" };

export default function AgentsPage() {
  return (
    <Suspense>
      <AgentsHome />
    </Suspense>
  );
}
