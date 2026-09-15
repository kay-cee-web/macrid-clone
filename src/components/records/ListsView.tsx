"use client";

import { ListChecks } from "lucide-react";
import type { Column } from "@/components/ui/DataTable";
import { useAsync } from "@/hooks/useAsync";
import { fetchLists } from "@/services/lists";
import type { RecordList } from "@/types/records";
import { CreatedCell, StackCell } from "./cells";
import { RecordsView } from "./RecordsView";

const columns: Column<RecordList>[] = [
  {
    key: "name",
    header: "List",
    cell: (list) => <StackCell primary={list.name} secondary={list.description} />,
  },
  { key: "contacts", header: "Contacts", numeric: true, cell: (list) => list.contactsCount },
  { key: "id", header: "ID", wide: true, cell: (list) => <span className="font-mono text-[12.5px] text-muted">{list.id}</span> },
  { key: "created", header: "Created", cell: (list) => <CreatedCell value={list.createdAt} /> },
];

export function ListsView() {
  const rows = useAsync(fetchLists, [], "Could not load your lists");

  return (
    <RecordsView
      noun="lists"
      rows={rows}
      columns={columns}
      rowKey={(list) => list.id}
      rowHref={(list) => `/records/lists/${list.id}`}
      matches={(list, q) => list.name.toLowerCase().includes(q) || list.description.toLowerCase().includes(q)}
      searchPlaceholder="Search lists"
      empty={{
        icon: <ListChecks />,
        title: "No lists yet",
        description: "Ask an agent to build one, e.g. “Create a list of dentists in Lagos”.",
      }}
    />
  );
}
