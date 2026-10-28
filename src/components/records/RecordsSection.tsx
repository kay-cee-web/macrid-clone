import type { ReactNode } from "react";

type RecordsSectionProps = {
  title: string;
  description?: ReactNode;
  /** Controls on the heading's right (a refresh, a filter). */
  action?: ReactNode;
  children: ReactNode;
};

/** One titled part of a records page, for pages that hold more than one table. */
export function RecordsSection({ title, description, action, children }: RecordsSectionProps) {
  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <h2 className="font-sans text-lg font-medium tracking-normal text-ink">{title}</h2>
          {description && <p className="max-w-[68ch] text-sm text-muted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
