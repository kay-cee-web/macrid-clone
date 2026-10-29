"use client";

import { useEffect, useState } from "react";
import { EyeOff, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { extractApiError } from "@/lib/api/errors";
import { hideModelJob, refreshModelJob } from "@/services/modelJobs";
import type { ModelJob } from "@/types/modelJob";
import { actionsColumn } from "./rowActions";

/** How often a running generation is checked (the backend guide asks for 3–5s). */
const POLL_MS = 4000;

/**
 * The generations table's buttons (Open the result, Hide from the grid) and
 * the polling: while any row is running, each one is re-checked through its
 * own route (which asks the provider) and the list is read again.
 */
export function useJobActions(rows: ModelJob[] | undefined, onChanged: () => void) {
  const [hiding, setHiding] = useState<ModelJob | null>(null);
  const running = (rows ?? []).filter((job) => job.status === "running").map((job) => job.id).join(",");

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      void Promise.allSettled(running.split(",").map(refreshModelJob)).then(onChanged);
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [running, onChanged]);

  const column = actionsColumn<ModelJob>([
    { label: "Open the result", icon: <ExternalLink />, onSelect: (j) => window.open(j.files[0], "_blank", "noopener"), hidden: (j) => !j.files[0] },
    { label: "Remove from the grid", icon: <EyeOff />, tone: "danger", onSelect: setHiding },
  ]);

  const dialogs = hiding && (
    <ConfirmModal
      title="Remove this from the grid?"
      description="It's hidden from Media studio. Its cost stays on your account's record."
      confirmLabel="Remove"
      onClose={() => setHiding(null)}
      onConfirm={async () => {
        try {
          await hideModelJob(hiding.id);
          toast.success("Removed from the grid.");
          onChanged();
          return true;
        } catch (err) {
          toast.error(extractApiError(err, "Could not remove that item"));
          return false;
        }
      }}
    />
  );

  return { column, dialogs };
}
