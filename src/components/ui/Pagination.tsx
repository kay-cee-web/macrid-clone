"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { pageWindow } from "@/lib/pageWindow";
import { IconButton } from "./IconButton";

type PaginationProps = {
  page: number;
  pageCount: number;
  onPage: (page: number) => void;
  /** Names the control for screen readers, e.g. "leads pages". */
  label?: string;
  className?: string;
};

/** Page numbers with gaps. Renders nothing when everything fits on one page. */
export function Pagination({ page, pageCount, onPage, label = "Pages", className }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label={label} className={cn("flex items-center gap-1", className)}>
      <IconButton label="Previous page" bordered disabled={page <= 1} onClick={() => onPage(page - 1)}>
        <ChevronLeft />
      </IconButton>

      {pageWindow(page, pageCount).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} aria-hidden className="px-1 text-sm text-faint">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPage(item)}
            className={cn(
              "h-8 min-w-8 rounded-lg px-2 font-mono text-sm tabular-nums transition-colors",
              item === page ? "bg-ink text-ground" : "text-muted hover:bg-raised hover:text-ink",
            )}
          >
            {item}
          </button>
        ),
      )}

      <IconButton label="Next page" bordered disabled={page >= pageCount} onClick={() => onPage(page + 1)}>
        <ChevronRight />
      </IconButton>
    </nav>
  );
}
