import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronsRight } from "lucide-react";

type AnnouncementPillProps = {
  href: string;
  children: ReactNode;
  /** The short tag on the left. */
  tag?: string;
};

/** A "New · something shipped »" pill that sits above a page headline. */
export function AnnouncementPill({ href, children, tag = "New" }: AnnouncementPillProps) {
  return (
    <Link
      href={href}
      className="inline-flex max-w-full items-center gap-3 rounded-full border border-line bg-surface/70 py-1.5 pl-4 pr-3 text-sm text-ink shadow-float backdrop-blur transition-colors hover:bg-surface"
    >
      <span className="font-medium text-accent">{tag}</span>
      <span aria-hidden className="h-4 w-px bg-line" />
      <span className="truncate">{children}</span>
      <ChevronsRight className="size-4 shrink-0 text-muted" />
    </Link>
  );
}
