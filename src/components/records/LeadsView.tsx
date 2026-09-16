"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";
import type { Column } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import { useAsync } from "@/hooks/useAsync";
import { statusLabel } from "@/lib/records/status";
import { fetchLeads } from "@/services/leads";
import { fetchLists } from "@/services/lists";
import type { Lead } from "@/types/records";
import { TextCell } from "./cells";
import { LEAD_COLUMNS, leadMatches } from "./leadColumns";
import { RecordsView } from "./RecordsView";

/** Every lead in the workspace, with the list it sits in and a status filter. */
export function LeadsView() {
  const state = useAsync(
    () => Promise.all([fetchLeads(), fetchLists()]).then(([page, lists]) => ({ ...page, lists })),
    [],
    "Could not load leads",
  );
  const [status, setStatus] = useState("");

  const listNames = useMemo(
    () => new Map((state.data?.lists ?? []).map((list) => [list.id, list.name])),
    [state.data?.lists],
  );
  // Casing varies (ACTIVE, not_contacted), so filter on the label.
  const statuses = useMemo(
    () => [...new Set((state.data?.leads ?? []).map((lead) => statusLabel(lead.status)).filter(Boolean))].sort(),
    [state.data?.leads],
  );
  const leads = state.data ? state.data.leads.filter((lead) => !status || statusLabel(lead.status) === status) : null;

  const columns: Column<Lead>[] = [
    ...LEAD_COLUMNS.slice(0, 2),
    {
      key: "list",
      header: "List",
      wide: true,
      cell: (lead) =>
        lead.listId ? (
          <Link href={`/records/lists/${lead.listId}`} className="relative z-10 text-muted underline-offset-2 hover:text-ink hover:underline">
            {listNames.get(lead.listId) ?? `List ${lead.listId}`}
          </Link>
        ) : (
          <TextCell value="" />
        ),
    },
    ...LEAD_COLUMNS.slice(2),
  ];

  return (
    <div className="grid gap-2">
      <RecordsView
        noun="leads"
        rows={{ ...state, data: leads }}
        columns={columns}
        rowKey={(lead) => lead.id}
        matches={leadMatches}
        searchPlaceholder="Search by name, email, phone or website"
        toolbar={
          <>
            <label htmlFor="lead-status" className="sr-only">Filter by status</label>
            <Select id="lead-status" className="w-44" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              {statuses.map((label) => (
                <option key={label} value={label}>{label}</option>
              ))}
            </Select>
          </>
        }
        empty={{
          icon: <UserRound />,
          title: status ? `No ${status.toLowerCase()} leads` : "No leads yet",
          description: "Ask an agent to find prospects, or to import leads into a list.",
        }}
      />
      {state.data?.truncated && (
        <p className="text-[12.5px] text-warn">Your workspace is very large; only the first 10,000 leads are shown.</p>
      )}
    </div>
  );
}
