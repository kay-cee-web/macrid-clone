import type { Metadata } from "next";
import { TasksView } from "@/components/records/TasksView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Tasks",
  description: "Tasks on your deals, with type, priority, status and due date.",
  path: "/records/tasks",
});

export default function RecordTasksPage() {
  return <TasksView />;
}
