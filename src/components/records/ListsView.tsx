"use client";

import { useState } from "react";
import { ListChecks, Trash } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { Column } from "@/components/ui/DataTable";
import { useAsync } from "@/hooks/useAsync";
import { extractApiError } from "@/lib/api/errors";
import { deleteList, fetchLists } from "@/services/lists";
import type { RecordList } from "@/types/records";
import { CreatedCell, StackCell } from "./cells";
import { RecordsView } from "./RecordsView";
import { actionsColumn } from "./rowActions";

const columns: Column<RecordList>[] = [
  {
    key: "name",
    header: "List",
    cell: (list) => <StackCell primary={list.name} secondary={list.description} />,
  },
  { key: "contacts", header: "Contacts", numeric: true, cell: (list) => list.contactsCount },
  { key: "id", header: "ID", wide: true, cell: (list) => <span className="font-mono text-xs text-muted">{list.id}</span> },
  { key: "created", header: "Created", cell: (list) => <CreatedCell value={list.createdAt} /> },
];

export function ListsView() {
  const rows = useAsync(fetchLists, [], "Could not load your lists");
  const [pending, setPending] = useState<RecordList | null>(null);

  async function remove(list: RecordList) {
    try {
      await deleteList(list.id);
      toast.success(`Deleted “${list.name}”.`);
      rows.reload();
      return true;
    } catch (err) {
      toast.error(extractApiError(err, "Could not delete the list"));
      return false;
    }
  }

  const withActions = [
    ...columns,
    actionsColumn<RecordList>([
      { label: "Delete list", icon: <Trash />, tone: "danger", onSelect: setPending },
    ]),
  ];

  return (
    <>
      <RecordsView
        noun="lists"
        rows={rows}
        columns={withActions}
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
      {pending && (
        <ConfirmModal
          title={`Delete “${pending.name}”?`}
          description={
            pending.contactsCount > 0
              ? `The list goes for good. Its ${pending.contactsCount} leads stay in your workspace.`
              : "The list goes for good. This can't be undone."
          }
          confirmLabel="Delete list"
          onConfirm={() => remove(pending)}
          onClose={() => setPending(null)}
        />
      )}
    </>
  );
}
