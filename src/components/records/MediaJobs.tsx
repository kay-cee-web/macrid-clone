"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { Column } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import { useAsync } from "@/hooks/useAsync";
import { statusLabel } from "@/lib/records/status";
import { fetchModelJobs } from "@/services/modelJobs";
import { JOB_CATEGORIES, JOB_STATUSES, type JobFilters, type ModelJob } from "@/types/modelJob";
import { CreatedCell, StackCell, TextCell } from "./cells";
import { FailureReason } from "./FailureReason";
import { JobPreview } from "./JobPreview";
import { RecordsSection } from "./RecordsSection";
import { RecordsView } from "./RecordsView";
import { useJobActions } from "./useJobActions";

const NO_FILTERS: JobFilters = { category: "", status: "" };

const columns: Column<ModelJob>[] = [
  { key: "preview", header: "Result", cell: (j) => <JobPreview job={j} /> },
  {
    key: "what",
    header: "What",
    cell: (j) => {
      const type = statusLabel(j.category);
      const primary = j.title || j.prompt || type || "Generation";
      // The type goes underneath only when it isn't already the heading.
      return <StackCell primary={primary} secondary={j.title ? j.prompt : primary === type ? "" : type} />;
    },
  },
  { key: "model", header: "Model", wide: true, cell: (j) => <TextCell value={j.model && <span className="font-mono text-xs">{j.model}</span>} muted /> },
  { key: "status", header: "Status", cell: (j) => <FailureReason status={j.status} reason={j.error} title={j.title || j.prompt.slice(0, 60) || "Generation"} /> },
  { key: "created", header: "Made", cell: (j) => <CreatedCell value={j.createdAt || null} /> },
];

const matches = (j: ModelJob, q: string) => [j.title, j.prompt, j.model, j.category, j.status].some((f) => f.toLowerCase().includes(q));

/** `GET /models/jobs`: everything agents generated, filtered on the server by category and status. */
export function MediaJobs() {
  const [filters, setFilters] = useState<JobFilters>(NO_FILTERS);
  const jobs = useAsync(() => fetchModelJobs(filters), [filters], "Could not load what your agents made");
  const set = (key: keyof JobFilters) => (e: { target: { value: string } }) => setFilters((f) => ({ ...f, [key]: e.target.value }));
  const filtered = Object.values(filters).some(Boolean);
  const actions = useJobActions(jobs.data?.rows, jobs.reload);

  return (
    <RecordsSection title="Made by your agents" description="Every image, video, track and voice-over an agent generated, newest first.">
      <RecordsView
        noun="generations"
        rows={{ ...jobs, data: jobs.data?.rows ?? null }}
        columns={[...columns, actions.column]}
        rowKey={(j) => j.id}
        matches={matches}
        searchPlaceholder="Search titles and prompts"
        toolbar={
          <>
            <label htmlFor="job-category" className="sr-only">Type</label>
            <Select id="job-category" className="w-36" value={filters.category} onChange={set("category")}>
              <option value="">All types</option>
              {JOB_CATEGORIES.map((c) => <option key={c} value={c}>{statusLabel(c)}</option>)}
            </Select>
            <label htmlFor="job-status" className="sr-only">Status</label>
            <Select id="job-status" className="w-36" value={filters.status} onChange={set("status")}>
              <option value="">All statuses</option>
              {JOB_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
            </Select>
          </>
        }
        empty={{
          icon: <Sparkles />,
          title: filtered ? "Nothing matches these filters" : "Nothing made yet",
          description: filtered ? "Try another type or status." : "Pick something to make below, and it lands here.",
        }}
      />
      {jobs.data && jobs.data.lastPage > 1 && (
        <p className="text-xs text-muted">Showing the latest {jobs.data.rows.length} of {jobs.data.total}.</p>
      )}
      {actions.dialogs}
    </RecordsSection>
  );
}
