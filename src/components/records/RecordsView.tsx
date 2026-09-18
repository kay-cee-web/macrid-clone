"use client";

import { useRef, useState, type ReactNode } from "react";
import { CircleAlert, RefreshCw, Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { cn } from "@/lib/cn";

type AsyncRows<T> = {
  data: T[] | null;
  status: "loading" | "ready" | "error";
  error: string | null;
  refreshing: boolean;
  reload: () => void;
};

type RecordsViewProps<T> = {
  /** Plural noun, e.g. "lists". */
  noun: string;
  rows: AsyncRows<T>;
  columns: Column<T>[];
  rowKey: (row: T) => string;
  rowHref?: (row: T) => string;
  matches: (row: T, query: string) => boolean;
  searchPlaceholder: string;
  empty: { icon: ReactNode; title: string; description: ReactNode };
  /** Extra controls beside the search (filters). */
  toolbar?: ReactNode;
  /** Rows per page. */
  pageSize?: number;
};

/** Search, refresh, and a table with loading, error and empty states. */
export function RecordsView<T>({
  noun,
  rows,
  columns,
  rowKey,
  rowHref,
  matches,
  searchPlaceholder,
  empty,
  toolbar,
  pageSize = 15,
}: RecordsViewProps<T>) {
  const [query, setQuery] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);
  const searchId = `search-${noun.replace(/\s+/g, "-").toLowerCase()}`;
  const q = query.trim().toLowerCase();
  const all = rows.data;
  const visible = all && q ? all.filter((row) => matches(row, q)) : all;
  const paged = usePagination(visible, pageSize, q);

  /** Turning the page keeps the top of the table in view, not the bottom. */
  const goToPage = (next: number) => {
    paged.setPage(next);
    tableRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={searchId} className="sr-only">
          Search {noun}
        </label>
        <Input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          leading={<Search />}
          className="h-9 min-w-0 flex-1 basis-60"
        />
        {toolbar}
        <Button
          variant="secondary"
          onClick={rows.reload}
          disabled={rows.refreshing}
          icon={<RefreshCw className={cn("size-3.5", rows.refreshing && "animate-spin")} />}
        >
          Refresh
        </Button>
      </div>

      {rows.status === "error" && !all ? (
        <EmptyState
          tone="bad"
          icon={<CircleAlert />}
          title={`Couldn't load ${noun}`}
          description={rows.error}
          action={<Button variant="secondary" onClick={rows.reload}>Try again</Button>}
        />
      ) : all && all.length === 0 ? (
        <EmptyState icon={empty.icon} title={empty.title} description={empty.description} />
      ) : visible && visible.length === 0 ? (
        <EmptyState
          icon={<SearchX />}
          title={`No ${noun} match`}
          description={`Nothing matches “${query.trim()}”.`}
          action={<Button variant="secondary" onClick={() => setQuery("")}>Clear search</Button>}
        />
      ) : (
        <>
          <div ref={tableRef} className="scroll-mt-4">
            <DataTable label={noun} columns={columns} rows={paged.rows} rowKey={rowKey} rowHref={rowHref} />
          </div>
          {all && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted">
                {paged.pageCount > 1 ? `${paged.from}–${paged.to} of ${paged.total}` : paged.total} {noun}
                {q && <span className="text-faint"> · filtered from {all.length}</span>}
                {rows.status === "error" && <span className="text-bad"> · Refresh failed: {rows.error}</span>}
              </p>
              <Pagination
                page={paged.page}
                pageCount={paged.pageCount}
                onPage={goToPage}
                label={`${noun} pages`}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
