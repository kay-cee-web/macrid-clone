import { api } from "./client";
import { assertEnvelope } from "./errors";
import { pickList, toNumber } from "./pick";

type Row = Record<string, unknown>;

/** Laravel paginators sit at the body, `data`, or under the resource key. */
function lastPageOf(body: unknown, key: string): number {
  const b = body as Row | undefined;
  const candidates = [b?.data, b, b?.[key]] as (Row | undefined)[];
  const paginator = candidates.find((c) => c && typeof c === "object" && "last_page" in c);
  return Math.max(1, toNumber(paginator?.last_page));
}

type PageOptions = {
  params?: Record<string, string | number>;
  /** The resource key rows may sit under, e.g. "appointments". */
  key: string;
  perPage: number;
  /** Stop after this many pages, so a huge workspace can't stall the view. */
  maxPages: number;
  fallback: string;
};

/**
 * Read every page of a Laravel paginator: page 1 first for `last_page`, then
 * the rest in parallel. `search` is ignored by these endpoints, so callers filter.
 */
export async function fetchAllPages(path: string, options: PageOptions): Promise<{ rows: Row[]; truncated: boolean }> {
  const get = async (page: number) => {
    const { data } = await api.get(path, { params: { ...options.params, page, per_page: options.perPage } });
    return assertEnvelope(data, options.fallback);
  };

  const first = await get(1);
  const lastPage = lastPageOf(first, options.key);
  const pages = Math.min(lastPage, options.maxPages);
  const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => get(i + 2)));
  const rows = [first, ...rest].flatMap((body) => pickList<Row>(body, options.key));
  return { rows, truncated: lastPage > pages };
}
