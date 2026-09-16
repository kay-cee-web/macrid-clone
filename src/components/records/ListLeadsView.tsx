"use client";

import Link from "next/link";
import { ArrowLeft, UserRound } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { fetchLeads } from "@/services/leads";
import { fetchList } from "@/services/lists";
import { LEAD_COLUMNS, leadMatches } from "./leadColumns";
import { RecordsView } from "./RecordsView";

export function ListLeadsView({ listId }: { listId: string }) {
  const state = useAsync(
    () => Promise.all([fetchList(listId), fetchLeads({ listId })]).then(([list, page]) => ({ list, ...page })),
    [listId],
    "Could not load this list",
  );
  const list = state.data?.list;

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Link href="/records/lists" className="inline-flex w-fit items-center gap-1.5 text-[13px] text-muted hover:text-ink">
          <ArrowLeft className="size-3.5" /> All lists
        </Link>
        {state.data ? (
          <div className="grid gap-1">
            <h2 className="text-[22px] font-semibold">{list?.name ?? `List ${listId}`}</h2>
            {list?.description && <p className="max-w-[64ch] text-[14px] text-muted">{list.description}</p>}
            {!list && <p className="text-[14px] text-warn">This list wasn&rsquo;t found. It may have been deleted.</p>}
          </div>
        ) : (
          <Skeleton className="h-7 w-56" />
        )}
      </div>

      <RecordsView
        noun="leads"
        rows={{ ...state, data: state.data?.leads ?? null }}
        columns={LEAD_COLUMNS}
        rowKey={(lead) => lead.id}
        matches={leadMatches}
        searchPlaceholder="Search by name, email, phone or website"
        empty={{
          icon: <UserRound />,
          title: "No leads in this list",
          description: "Ask an agent to find prospects and add them to this list.",
        }}
      />
      {state.data?.truncated && (
        <p className="text-[12.5px] text-warn">This list is very large; only the first 10,000 leads are shown.</p>
      )}
    </div>
  );
}
