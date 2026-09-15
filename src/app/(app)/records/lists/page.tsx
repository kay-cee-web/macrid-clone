import type { Metadata } from "next";
import { ListsView } from "@/components/records/ListsView";

export const metadata: Metadata = { title: "Lists" };

export default function RecordListsPage() {
  return <ListsView />;
}
