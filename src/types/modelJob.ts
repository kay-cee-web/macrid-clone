/** The media categories `GET /models` lists (llm aside; probed 2026-10-29) — there is no `script`. */
export const JOB_CATEGORIES = ["image", "video", "music", "speech"] as const;

/** The statuses `?status=` filters on. */
export const JOB_STATUSES = ["running", "done", "failed"] as const;

/**
 * One row of `GET /models/jobs` (a paginator at `data`): a `DexiMediaJob`
 * with its `model` (`{id, slug, name, category}`) loaded and `files` added —
 * our stored copies first, the provider's URLs only as a fallback.
 */
export type ModelJob = {
  id: string;
  category: string;
  kind: string;
  title: string;
  prompt: string;
  /** The model's display name, else its slug. */
  model: string;
  status: string;
  /** Hosted results, best first. */
  files: string[];
  error: string;
  createdAt: string;
};

export type JobFilters = { category: string; status: string };
