import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { fetchPage } from "@/lib/api/paginate";
import { pickField, toText } from "@/lib/api/pick";
import type { JobFilters, ModelJob } from "@/types/modelJob";

type Row = Record<string, unknown>;

const strings = (value: unknown) => (Array.isArray(value) ? value.map(toText).filter(Boolean) : []);

/** The job's failure in the backend's words; the column name isn't in the controller, so a few are tried. */
const errorOf = (row: Row) => {
  const result = (row.result ?? {}) as Row;
  return toText(pickField(row, ["error", "last_error", "failure_reason"]) ?? pickField(result, ["error", "message"]));
};

function toJob(row: Row): ModelJob {
  const model = (row.model ?? {}) as Row;
  const category = toText(row.category ?? model.category).toLowerCase();
  return {
    id: toText(row.id),
    category,
    kind: toText(row.kind).toLowerCase() || category,
    title: toText(row.title),
    // A speech job left `prompt` null and kept the text in `request` (seen 2026-10-29).
    prompt: toText(row.prompt) || toText(pickField(row.request, ["prompt", "text", "input"])),
    model: toText(model.name) || toText(model.slug),
    status: toText(row.status),
    files: strings(row.files),
    error: errorOf(row),
    createdAt: toText(row.created_at),
  };
}

/**
 * `GET /models/jobs?category=&status=&per_page=` (DexiModelController::jobs):
 * `{success, data: <paginator>}`, newest first, hidden rows skipped, at most
 * 100 a page. `search` also exists and matches title and prompt.
 */
export async function fetchModelJobs(filters: JobFilters) {
  const page = await fetchPage("/models/jobs", "data", { ...filters, per_page: "100" }, "Could not load what your agents made");
  return { ...page, rows: page.rows.map(toJob) };
}

/** `GET /models/jobs/{id}`: one job, and asks the provider for its latest status on the way. */
export async function refreshModelJob(id: string) {
  const { data } = await api.get(`/models/jobs/${id}`);
  assertEnvelope(data, "Could not check that generation");
}

/**
 * `DELETE /models/jobs/{id}` → `hideJob`: off the grid, billing record kept.
 * The backend guide lists this route as still to add (2026-10-29), so a 404
 * here means it isn't deployed yet.
 */
export async function hideModelJob(id: string) {
  const { data } = await api.delete(`/models/jobs/${id}`);
  assertEnvelope(data, "Could not remove that item");
}
