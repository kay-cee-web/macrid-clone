import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Skeleton } from "./Skeleton";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Right-align numbers. */
  numeric?: boolean;
  /** Hide on narrow screens to keep the table readable. */
  wide?: boolean;
  /** Keep the header for screen readers but not on screen (an actions column). */
  hideHeader?: boolean;
  className?: string;
};

type DataTableProps<T> = {
  label: string;
  columns: Column<T>[];
  rows: T[] | null;
  rowKey: (row: T) => string;
  /** Makes the first cell a link that covers the whole row. */
  rowHref?: (row: T) => string;
  skeletonRows?: number;
};

/** A hairline table. `rows === null` shows skeleton rows while loading. */
export function DataTable<T>({ label, columns, rows, rowKey, rowHref, skeletonRows = 5 }: DataTableProps<T>) {
  const cellBase = "px-4 py-3 align-middle";
  const hideNarrow = (wide?: boolean) => wide && "hidden md:table-cell";

  return (
    <div className="overflow-x-auto rounded-[14px] border border-line bg-surface">
      <table aria-label={label} className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  cellBase,
                  "py-2.5 font-mono text-xs font-normal uppercase tracking-[0.06em] text-muted",
                  column.numeric && "text-right",
                  hideNarrow(column.wide),
                )}
              >
                {column.hideHeader ? <span className="sr-only">{column.header}</span> : column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows === null
            ? Array.from({ length: skeletonRows }, (_, index) => (
                <tr key={index} className="border-b border-line last:border-b-0">
                  {columns.map((column) => (
                    <td key={column.key} className={cn(cellBase, hideNarrow(column.wide))}>
                      <Skeleton className={cn("h-3.5", column.numeric ? "ml-auto w-10" : "w-3/4")} />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row) => {
                const href = rowHref?.(row);
                return (
                  <tr
                    key={rowKey(row)}
                    className={cn("border-b border-line last:border-b-0", href && "relative transition-colors hover:bg-raised")}
                  >
                    {columns.map((column, index) => (
                      <td
                        key={column.key}
                        className={cn(
                          cellBase,
                          column.numeric && "text-right font-mono tabular-nums",
                          hideNarrow(column.wide),
                          column.className,
                        )}
                      >
                        {href && index === 0 ? (
                          <Link href={href} className="font-medium text-ink after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-accent">
                            {column.cell(row)}
                          </Link>
                        ) : (
                          column.cell(row)
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}
