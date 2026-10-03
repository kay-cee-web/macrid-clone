import type { Metadata } from "next";
import { ListLeadsView } from "@/components/records/ListLeadsView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({ title: "List", description: "The leads in one of your lists." });

export default async function RecordListPage({ params }: PageProps<"/records/lists/[listId]">) {
  const { listId } = await params;
  return <ListLeadsView listId={listId} />;
}
