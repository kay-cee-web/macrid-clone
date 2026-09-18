/** A gap stands for the page numbers left out between two shown ones. */
export type PageItem = number | "gap";

/**
 * Which page numbers to show: the first, the last, and the current page with
 * `span` either side. Anything skipped becomes one gap.
 */
export function pageWindow(page: number, pageCount: number, span = 1): PageItem[] {
  if (pageCount < 1) return [];

  const wanted = new Set([1, pageCount]);
  for (let p = page - span; p <= page + span; p += 1) {
    if (p >= 1 && p <= pageCount) wanted.add(p);
  }

  const pages = [...wanted].sort((a, b) => a - b);
  return pages.flatMap((p, i) => (i > 0 && p - pages[i - 1] > 1 ? ["gap" as const, p] : [p]));
}
