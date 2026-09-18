"use client";

import type { ReactNode } from "react";
import type { Column } from "@/components/ui/DataTable";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";

export type RowAction<T> = {
  /** Spoken and shown on hover, so it names the row's action ("Delete list"). */
  label: string;
  icon: ReactNode;
  tone?: "danger";
  onSelect: (row: T) => void;
  /** Hide the button on rows it doesn't apply to. */
  hidden?: (row: T) => boolean;
};

/**
 * The trailing action column for a records table. Buttons, not a dropdown:
 * `DataTable`'s wrapper is `overflow-x-auto`, which clips vertically too, so a
 * menu on the last row would be cut off.
 *
 * `rowHref` lays the row's link over every cell (`after:inset-0`), so the
 * buttons are raised above it — otherwise a click would navigate instead.
 */
export function actionsColumn<T>(actions: RowAction<T>[]): Column<T> {
  return {
    key: "actions",
    header: "Actions",
    hideHeader: true,
    className: "w-px",
    cell: (row) => (
      <div className="relative z-10 flex justify-end gap-1">
        {actions.map((action) =>
          action.hidden?.(row) ? null : (
            <IconButton
              key={action.label}
              size="sm"
              label={action.label}
              onClick={() => action.onSelect(row)}
              className={cn(action.tone === "danger" && "hover:bg-bad-soft hover:text-bad")}
            >
              {action.icon}
            </IconButton>
          ),
        )}
      </div>
    ),
  };
}
