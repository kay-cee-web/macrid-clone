/** Where a change landed; also the receipt's stat label. In display order. */
export const WORK_AREAS = ["Leads", "Lists", "Deals", "Tasks", "Meetings", "Campaigns", "Funnels"] as const;
export type WorkArea = (typeof WORK_AREAS)[number];

/** One thing that changed in the workspace while an agent turn ran. */
export type WorkChange = {
  area: WorkArea;
  text: string;
  /** The Records page that shows it. */
  href: string;
  /** How much it adds to the area's stat (leads count one by one). */
  count: number;
};
