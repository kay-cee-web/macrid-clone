import type { Metadata } from "next";
import { Suspense } from "react";
import { AgentsHome } from "@/components/agents/AgentsHome";
import { pageMetadata, SITE } from "@/lib/seo/site";

/** The domain root: the link people share, so it's the one signed-in route that's indexed. */
export const metadata: Metadata = {
  ...pageMetadata({ title: SITE.title, description: SITE.description, path: "/", index: true }),
  title: { absolute: SITE.title },
};

export default function HomePage() {
  return (
    <Suspense>
      <AgentsHome />
    </Suspense>
  );
}
