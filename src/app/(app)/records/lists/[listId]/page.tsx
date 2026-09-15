import type { Metadata } from "next";
import { ListLeadsView } from "@/components/records/ListLeadsView";

export const metadata: Metadata = { title: "List" };

export default async function RecordListPage({ params }: PageProps<"/records/lists/[listId]">) {
  const { listId } = await params;
  return <ListLeadsView listId={listId} />;
}
