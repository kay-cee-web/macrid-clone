import type { Metadata } from "next";
import { TasksView } from "@/components/records/TasksView";

export const metadata: Metadata = { title: "Tasks" };

export default function RecordTasksPage() {
  return <TasksView />;
}
