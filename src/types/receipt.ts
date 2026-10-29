/** Where a change landed; also the receipt's stat label. In display order. */
export const WORK_AREAS = ["Customers", "Lists", "Deals", "Tasks", "Meetings", "Campaigns"] as const;
export type WorkArea = (typeof WORK_AREAS)[number];

/** One thing that changed in the workspace while an agent turn ran. */
export type WorkChange = {
  area: WorkArea;
  text: string;
  /** The Records page that shows it; none for deals, which Records doesn't list. */
  href?: string;
  /** How much it adds to the area's stat (customers count one by one). */
  count: number;
};
