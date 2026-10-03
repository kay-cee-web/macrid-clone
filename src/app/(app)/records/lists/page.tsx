import type { Metadata } from "next";
import { ListsView } from "@/components/records/ListsView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Lists",
  description: "The lead lists in your workspace, with how many contacts each one holds.",
  path: "/records/lists",
});

export default function RecordListsPage() {
  return <ListsView />;
}
