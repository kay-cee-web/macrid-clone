import type { Metadata } from "next";
import { NotesView } from "@/components/notes/NotesView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Notes",
  description: "Write-ups from calls the notetaker sat in on, and notes you write yourself.",
  path: "/notes",
});

export default function NotesPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto grid w-full max-w-400 gap-5 px-4 pb-16 pt-8 sm:px-6 xl:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-5">
          <div className="grid gap-1.5">
            <h1 className="text-2xl font-semibold">Notes</h1>
            <p className="text-sm text-muted">
              Write-ups from calls the notetaker sat in on, and anything you write yourself.
            </p>
          </div>

          <NotesView />
        </div>
      </div>
    </div>
  );
}
