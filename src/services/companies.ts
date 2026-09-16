import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList, toNumber } from "@/lib/api/pick";
import { newestFirst, normalizeCompany } from "@/lib/records/normalizeCrm";
import type { Company } from "@/types/records";

type Row = Record<string, unknown>;

/** Stop after this many pages so a huge workspace can't stall the view. */
const MAX_PAGES = 20;

async function readPage(page: number) {
  const { data } = await api.get("/companies", { params: { page } });
  return assertEnvelope(data, "Could not load companies") as Row;
}

/**
 * GET /companies?page → `{companies, teams}`. Macrid's own code treats
 * `companies` as both a plain array and a paginator, so accept either.
 */
export async function fetchCompanies(): Promise<Company[]> {
  const first = await readPage(1);
  const companies = (first.companies ?? (first.data as Row | undefined)?.companies) as Row | Row[] | undefined;

  let rows: Row[];
  if (Array.isArray(companies)) {
    rows = companies;
  } else if (companies && Array.isArray(companies.data)) {
    const pages = Math.min(Math.max(1, toNumber(companies.last_page)), MAX_PAGES);
    const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => readPage(i + 2)));
    rows = [companies.data as Row[], ...rest.map((body) => ((body.companies as Row | undefined)?.data as Row[]) ?? [])].flat();
  } else {
    rows = pickList<Row>(first, "companies");
  }
  return newestFirst(rows.map(normalizeCompany));
}
