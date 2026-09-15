"use client";

import { SquareCheckBig } from "lucide-react";
import type { Column } from "@/components/ui/DataTable";
import { useAsync } from "@/hooks/useAsync";
import { formatDate } from "@/lib/format";
import { fetchTasks } from "@/services/tasks";
import type { Task } from "@/types/records";
import { CreatedCell, StackCell, StatusCell, TextCell } from "./cells";
import { RecordsView } from "./RecordsView";

const columns: Column<Task>[] = [
  { key: "name", header: "Task", cell: (task) => <StackCell primary={<span className="font-medium">{task.name}</span>} secondary={task.note} /> },
  { key: "type", header: "Type", wide: true, cell: (task) => <TextCell value={task.type} muted /> },
  { key: "priority", header: "Priority", wide: true, cell: (task) => <TextCell value={task.priority} muted /> },
  { key: "status", header: "Status", cell: (task) => <StatusCell status={task.status} /> },
  { key: "deal", header: "Deal", wide: true, cell: (task) => <TextCell value={task.deal} muted /> },
  { key: "due", header: "Due", cell: (task) => <TextCell value={formatDate(task.endDate)} muted /> },
  { key: "created", header: "Created", wide: true, cell: (task) => <CreatedCell value={task.createdAt} /> },
];

const matches = (task: Task, q: string) =>
  [task.name, task.note, task.deal, task.owner, task.type, task.status].some((field) => field.toLowerCase().includes(q));

export function TasksView() {
  const rows = useAsync(fetchTasks, [], "Could not load your tasks");

  return (
    <RecordsView
      noun="tasks"
      rows={rows}
      columns={columns}
      rowKey={(task) => task.id}
      matches={matches}
      searchPlaceholder="Search tasks"
      empty={{
        icon: <SquareCheckBig />,
        title: "No tasks yet",
        description: "Ask an agent to set a follow-up task on a deal.",
      }}
    />
  );
}
