"use client";

import { useCallback, useMemo, useState } from "react";

/**
 * Paging over rows already in memory. The records endpoints are read whole
 * (`fetchAllPages`), so this only decides how much of that is on screen.
 *
 * `resetKey` sends the reader back to page one when the set underneath changes
 * — a new search, say. It's stored beside the page rather than watched in an
 * effect, so the reset happens in the same render as the change. A page beyond
 * the end is clamped, so a shrinking set never leaves an empty table.
 */
export function usePagination<T>(rows: T[] | null, pageSize: number, resetKey: unknown) {
  const key = `${pageSize}|${String(resetKey)}`;
  const [saved, setSaved] = useState({ key, page: 1 });
  const setPage = useCallback((page: number) => setSaved({ key, page }), [key]);

  const total = rows?.length ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(saved.key === key ? saved.page : 1, pageCount);

  const visible = useMemo(
    () => (rows ? rows.slice((current - 1) * pageSize, current * pageSize) : null),
    [rows, current, pageSize],
  );

  return {
    rows: visible,
    page: current,
    pageCount,
    setPage,
    total,
    /** 1-based range on screen, for "12–24 of 300". */
    from: total === 0 ? 0 : (current - 1) * pageSize + 1,
    to: Math.min(current * pageSize, total),
  };
}
