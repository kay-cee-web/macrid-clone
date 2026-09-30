import type { Metadata } from "next";
import { NotesTab } from "@/components/workspace/NotesTab";

export const metadata: Metadata = { title: "Notes" };

export default function AgentNotesPage() {
  return <NotesTab />;
}
