/** Funnel campaigns (landing pages and embeds), normalised from /funnel-campaigns. */
export type Funnel = {
  id: string;
  slug: string;
  name: string;
  /** landing_page, popup, … as Macrid names the format. */
  format: string;
  published: boolean;
  /** Public address when there is one; the backend builds it. */
  url: string;
  createdAt: string | null;
};

export type FunnelStats = {
  views: number;
  clicks: number;
  uniqueVisitors: number;
  /** Percent change against the previous period, when the API sends it. */
  viewsChange: number | null;
  clicksChange: number | null;
  visitorsChange: number | null;
};

export type FunnelEvent = {
  id: string;
  action: "view" | "click" | string;
  location: string;
  device: string;
  referrer: string;
  at: string | null;
};
