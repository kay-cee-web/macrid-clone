"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { fetchLeads } from "@/services/leads";
import { fetchList } from "@/services/lists";
import { ExportCustomers } from "./ExportCustomers";
import { LEAD_COLUMNS, leadMatches } from "./leadColumns";
import { ListEditModal } from "./ListEditModal";
import { RecordsView } from "./RecordsView";
import { useCustomerEdit } from "./useCustomerEdit";

export function ListLeadsView({ listId }: { listId: string }) {
  const state = useAsync(
    () => Promise.all([fetchList(listId), fetchLeads({ listId })]).then(([list, page]) => ({ list, ...page })),
    [listId],
    "Could not load this list",
  );
  const list = state.data?.list;
  const [editing, setEditing] = useState(false);
  const customerEdit = useCustomerEdit(state.reload);

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Link href="/records/lists" className="inline-flex w-fit items-center gap-1.5 text-sm text-muted hover:text-ink">
          <ArrowLeft className="size-3.5" /> All lists
        </Link>
        {state.data ? (
          <div className="grid gap-1">
            <h2 className="text-2xl font-semibold">{list?.name ?? `List ${listId}`}</h2>
            {list?.description && <p className="max-w-[64ch] text-sm text-muted">{list.description}</p>}
            {!list && <p className="text-sm text-warn">This list wasn&rsquo;t found. It may have been deleted.</p>}
          </div>
        ) : (
          <Skeleton className="h-7 w-56" />
        )}
      </div>

      <RecordsView
        noun="customers"
        rows={{ ...state, data: state.data?.leads ?? null }}
        columns={[...LEAD_COLUMNS, customerEdit.column]}
        rowKey={(lead) => lead.id}
        matches={leadMatches}
        searchPlaceholder="Search by name, email, phone or website"
        toolbar={
          <>
            {list && (
              <Button variant="secondary" icon={<Pencil className="size-3.5" />} onClick={() => setEditing(true)}>
                Edit
              </Button>
            )}
            <ExportCustomers customers={state.data?.leads ?? null} title={list?.name ?? `List ${listId}`} />
          </>
        }
        empty={{
          icon: <UserRound />,
          title: "No customers in this list",
          description: "Ask an agent to find prospects and add them to this list.",
        }}
      />
      {state.data?.truncated && (
        <p className="text-xs text-warn">This list is very large; only the first 10,000 customers are shown.</p>
      )}
      {customerEdit.dialog}
      {editing && list && <ListEditModal list={list} onClose={() => setEditing(false)} onSaved={state.reload} />}
    </div>
  );
}
