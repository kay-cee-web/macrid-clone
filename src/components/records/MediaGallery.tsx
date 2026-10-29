"use client";

import { useState } from "react";
import { CircleAlert, Images, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { extractApiError } from "@/lib/api/errors";
import { cn } from "@/lib/cn";
import { countOf } from "@/lib/format";
import { deleteGalleryItem, fetchGallery } from "@/services/gallery";
import type { GalleryItem, MediaType } from "@/types/gallery";
import { MediaTile } from "./MediaTile";
import { RecordsSection } from "./RecordsSection";

type Filter = "all" | MediaType;
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "image", label: "Images" },
  { value: "video", label: "Video" },
  { value: "audio", label: "Audio" },
  { value: "document", label: "Documents" },
];

/** The workspace's hosted files, paged and filtered by type on the server. */
export function MediaGallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const files = useAsync(() => fetchGallery(filter === "all" ? null : filter, page), [filter, page], "Could not load your media");
  const [deleting, setDeleting] = useState<GalleryItem | null>(null);
  const shown = files.data?.items ?? null;
  const pick = (next: Filter) => {
    setFilter(next);
    setPage(1);
  };

  return (
    <RecordsSection
      title="Gallery"
      description="Files you uploaded or attached in chat."
      action={
        <div className="flex flex-wrap items-center gap-2">
          <FilterChips label="Filter media" value={filter} items={FILTERS} onChange={pick} variant="outline" />
          <Button variant="secondary" onClick={files.reload} disabled={files.refreshing}
            icon={<RefreshCw className={cn("size-3.5", files.refreshing && "animate-spin")} />}>
            Refresh
          </Button>
        </div>
      }
    >
      {files.status === "loading" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="aspect-4/3" />)}
        </div>
      ) : files.status === "error" && !files.data ? (
        <EmptyState tone="bad" icon={<CircleAlert />} title="Couldn't load your media" description={files.error}
          action={<Button variant="secondary" onClick={files.reload}>Try again</Button>} />
      ) : !shown?.length ? (
        <EmptyState icon={<Images />}
          title={filter === "all" ? "Nothing here yet" : `No ${FILTERS.find((f) => f.value === filter)?.label.toLowerCase()} yet`}
          description="Pick something to make above, or attach a file in any chat." />
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((item) => <MediaTile key={item.id || item.url} item={item} onDelete={setDeleting} />)}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted">{countOf(files.data?.total ?? 0, "files")}</p>
            <Pagination page={page} pageCount={files.data?.lastPage ?? 1} onPage={setPage} label="Gallery pages" />
          </div>
        </>
      )}

      {deleting && (
        <ConfirmModal
          title={`Delete ${deleting.name}?`}
          description="The file goes for good, and any link to it, in a chat or a post, stops working."
          confirmLabel="Delete"
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            try {
              await deleteGalleryItem(deleting.id);
              toast.success(`${deleting.name} deleted.`);
              files.reload();
              return true;
            } catch (err) {
              toast.error(extractApiError(err, "Could not delete that file"));
              return false;
            }
          }}
        />
      )}
    </RecordsSection>
  );
}
